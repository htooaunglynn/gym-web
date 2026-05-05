import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient, setApiContext } from "./client";

describe("apiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    setApiContext(null, () => {});
  });

  it("attaches Bearer token to every request", async () => {
    setApiContext("test-token", vi.fn());

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { success: true } }),
    });

    await apiClient("/test");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/tenant/test"),
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );

    const callArgs = (global.fetch as any).mock.calls[0];
    const headers = callArgs[1].headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer test-token");
  });

  it("retries once on 401 then calls logout if fails again", async () => {
    const mockLogout = vi.fn();
    setApiContext("old-token", mockLogout);

    // Mock fetch implementation
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes("/api/tenant/auth/refresh")) {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 401,
        json: async () => ({}),
      });
    });

    await expect(apiClient("/test")).rejects.toThrow("Session expired");

    // 1st request + 1 refresh attempt
    expect(global.fetch).toHaveBeenCalledTimes(2);
    // Triggered logout callback
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("retries successfully on 401 if refresh succeeds", async () => {
    const mockLogout = vi.fn();
    setApiContext("old-token", mockLogout);

    let requestCount = 0;
    (global.fetch as any).mockImplementation((url: string, options: any) => {
      if (url.includes("/api/tenant/auth/refresh")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ data: { accessToken: "new-token" } }),
        });
      }
      
      requestCount++;
      if (requestCount === 1) {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        });
      }

      // 2nd request (retry) -> 200 OK
      const headers = options.headers as Headers;
      expect(headers.get("Authorization")).toBe("Bearer new-token");

      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ data: { success: true } }),
      });
    });

    const res = await apiClient("/test");
    expect(res).toEqual({ success: true });

    // 1st request + 1 refresh attempt + 1 retry = 3 fetch calls
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});

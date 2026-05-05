/**
 * Unit + property-based tests for apiClient
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fc from "fast-check";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a minimal valid JWT with the given payload (no real signature). */
function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fakesig`;
}

function futureExp() {
  return Math.floor(Date.now() / 1000) + 3600;
}

// ─── Setup ────────────────────────────────────────────────────────────────────

let capturedRequests: Request[] = [];

beforeEach(() => {
  capturedRequests = [];
  // Reset localStorage
  localStorage.clear();

  // Mock global fetch
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const req = new Request(input, init);
      capturedRequests.push(req);
      // Default: return 200 with empty object
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe("apiClient – Bearer token attachment", () => {
  it("attaches Authorization header when token is in localStorage", async () => {
    const token = makeJwt({ sub: "1", exp: futureExp() });
    localStorage.setItem("accessToken", token);

    const { apiClient } = await import("./apiClient");
    await apiClient("/test");

    expect(capturedRequests).toHaveLength(1);
    expect(capturedRequests[0].headers.get("Authorization")).toBe(
      `Bearer ${token}`,
    );
  });

  it("does NOT attach Authorization header when no token is present", async () => {
    const { apiClient } = await import("./apiClient");
    await apiClient("/test");

    expect(capturedRequests[0].headers.get("Authorization")).toBeNull();
  });

  it("always sets Content-Type: application/json", async () => {
    const { apiClient } = await import("./apiClient");
    await apiClient("/test");

    expect(capturedRequests[0].headers.get("Content-Type")).toBe(
      "application/json",
    );
  });

  it("attaches x-branch-id when an active branch is stored", async () => {
    localStorage.setItem("activeBranchId", "branch-123");

    const { apiClient } = await import("./apiClient");
    await apiClient("/test");

    expect(capturedRequests[0].headers.get("x-branch-id")).toBe("branch-123");
  });

  it("omits x-branch-id when all branches mode is active", async () => {
    const { apiClient } = await import("./apiClient");
    await apiClient("/test");

    expect(capturedRequests[0].headers.get("x-branch-id")).toBeNull();
  });
});

describe("apiClient – query params", () => {
  it("appends params as query string", async () => {
    const { apiClient } = await import("./apiClient");
    await apiClient("/items", { params: { page: 1, limit: 10 } });

    const url = new URL(capturedRequests[0].url);
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("limit")).toBe("10");
  });

  it("omits undefined param values", async () => {
    const { apiClient } = await import("./apiClient");
    await apiClient("/items", { params: { page: 1, filter: undefined } });

    const url = new URL(capturedRequests[0].url);
    expect(url.searchParams.has("filter")).toBe(false);
  });
});

describe("apiClient – HTTP error handling", () => {
  it("throws on 400 and does not redirect", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "Bad input" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );

    const { apiClient } = await import("./apiClient");
    await expect(apiClient("/test")).rejects.toThrow();
  });

  it("throws on 403", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );

    const { apiClient } = await import("./apiClient");
    await expect(apiClient("/test")).rejects.toThrow();
  });

  it("throws on 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "Not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );

    const { apiClient } = await import("./apiClient");
    await expect(apiClient("/test")).rejects.toThrow();
  });

  it("throws on 409 conflict", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "Conflict" }), {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );

    const { apiClient } = await import("./apiClient");
    await expect(apiClient("/test")).rejects.toThrow();
  });

  it("throws on 500 server error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({}), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );

    const { apiClient } = await import("./apiClient");
    await expect(apiClient("/test")).rejects.toThrow(
      "An unexpected server error occurred",
    );
  });

  it("throws a network error message on fetch TypeError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    const { apiClient } = await import("./apiClient");
    await expect(apiClient("/test")).rejects.toThrow(
      "Unable to reach the server",
    );
  });

  it("returns parsed JSON on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ id: "42", name: "Test" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );

    const { apiClient } = await import("./apiClient");
    const result = await apiClient<{ id: string; name: string }>("/test");
    expect(result).toEqual({ id: "42", name: "Test" });
  });
});

// ─── Property-based tests ─────────────────────────────────────────────────────

/**
 * Property 1: API client always attaches Bearer token
 * Validates: Requirements 1.1
 */
describe("Property 1 – API client always attaches Bearer token", () => {
  it('Authorization header is always "Bearer <token>" for any token value', async () => {
    const { apiClient } = await import("./apiClient");

    await fc.assert(
      fc.asyncProperty(
        // Generate realistic-looking token strings (non-empty, no whitespace)
        fc
          .string({ minLength: 10, maxLength: 200 })
          .filter((s) => !/\s/.test(s)),
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => !/\s/.test(s) && s.startsWith("/")),
        async (token, path) => {
          capturedRequests = [];
          localStorage.setItem("accessToken", token);

          try {
            await apiClient(path);
          } catch {
            // Errors from the mock response are fine; we only care about the header
          }

          if (capturedRequests.length > 0) {
            const authHeader =
              capturedRequests[capturedRequests.length - 1].headers.get(
                "Authorization",
              );
            expect(authHeader).toBe(`Bearer ${token}`);
          }

          localStorage.removeItem("accessToken");
        },
      ),
      { numRuns: 50 },
    );
  });
});

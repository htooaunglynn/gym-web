import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { silentRefreshApi } from "../api/client";

// Simple mock for jwtDecode to avoid full token generation
vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(() => ({
    sub: "123",
    email: "test@example.com",
    role: "ADMIN",
    exp: Date.now() + 10000,
  })),
}));

// Mock the client to intercept silentRefreshApi internally
vi.mock("../api/client", () => ({
  setApiContext: vi.fn(),
  silentRefreshApi: vi.fn(),
}));

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    Storage.prototype.setItem = vi.fn(); // Spy on localStorage
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it("silentRefresh(): on mount, called automatically and failure leaves user as null without throwing", async () => {
    vi.mocked(silentRefreshApi).mockRejectedValueOnce(new Error("No token"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for the effect to settle
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(silentRefreshApi).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("login(): accessToken stored in state, NOT in localStorage", async () => {
    vi.mocked(silentRefreshApi).mockRejectedValueOnce(new Error("No init token"));

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: { accessToken: "fake-jwt-token" } }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.accessToken).toBe("fake-jwt-token");
    expect(result.current.isAuthenticated).toBe(true);
    // Ensure localStorage was NEVER touched
    expect(Storage.prototype.setItem).not.toHaveBeenCalled();
  });

  it("login(): 429 response -> throws correct error message", async () => {
    vi.mocked(silentRefreshApi).mockRejectedValueOnce(new Error("No init token"));

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(result.current.login("test@example.com", "password")).rejects.toThrow(
      "Too many attempts. Try again in 10 minutes."
    );
  });
});

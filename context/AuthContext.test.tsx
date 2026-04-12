import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ACCESS_TOKEN_KEY, CURRENT_USER_KEY } from "@/lib/constants";
import { buildUser } from "@/mocks/factories";

const LEGACY_USER_KEY = "user";

// ─── localStorage mock ────────────────────────────────────────────────────────
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: vi.fn((key: string) => { delete store[key]; }),
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(global, "localStorage", {
    value: localStorageMock,
    writable: true,
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(AuthProvider, null, children);

beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
});

describe("AuthContext — initial state", () => {
    it("starts unauthenticated when localStorage is empty", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        // Wait for effect to run
        await act(async () => { });
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
    });

    it("isLoading becomes false after hydration", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => { });
        expect(result.current.isLoading).toBe(false);
    });
});

describe("AuthContext — hydration from localStorage", () => {
    it("hydrates user and token from stored values", async () => {
        const user = buildUser({ id: "u-1", email: "admin@example.com" });
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === ACCESS_TOKEN_KEY) return "stored-token";
            if (key === CURRENT_USER_KEY) return JSON.stringify(user);
            return null;
        });

        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => { });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe("stored-token");
        expect(result.current.user).toEqual(user);
    });

    it("clears partial cache when token exists but user is missing", async () => {
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === ACCESS_TOKEN_KEY) return "orphan-token";
            return null;
        });

        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => { });

        expect(result.current.isAuthenticated).toBe(false);
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
    });

    it("ignores corrupted JSON without crashing", async () => {
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === ACCESS_TOKEN_KEY) return "token";
            if (key === CURRENT_USER_KEY) return "{ invalid json }}}";
            return null;
        });

        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => { });

        expect(result.current.isAuthenticated).toBe(false);
    });

    it("reads from legacy 'user' key as fallback", async () => {
        const user = buildUser({ id: "u-legacy" });
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === ACCESS_TOKEN_KEY) return "token";
            if (key === CURRENT_USER_KEY) return null;
            if (key === LEGACY_USER_KEY) return JSON.stringify(user);
            return null;
        });

        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => { });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.id).toBe("u-legacy");
    });
});

describe("AuthContext — setAuth", () => {
    it("updates user, token, and persists to localStorage", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => { });

        const user = buildUser({ id: "u-new" });
        act(() => {
            result.current.setAuth(user, "new-jwt");
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe("new-jwt");
        expect(result.current.user).toEqual(user);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(ACCESS_TOKEN_KEY, "new-jwt");
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            CURRENT_USER_KEY,
            JSON.stringify(user)
        );
    });

    it("removes legacy key on setAuth", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => { });

        act(() => {
            result.current.setAuth(buildUser(), "token");
        });

        expect(localStorageMock.removeItem).toHaveBeenCalledWith(LEGACY_USER_KEY);
    });
});

describe("AuthContext — logout", () => {
    it("clears user, token, and localStorage", async () => {
        const user = buildUser();
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === ACCESS_TOKEN_KEY) return "token";
            if (key === CURRENT_USER_KEY) return JSON.stringify(user);
            return null;
        });

        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => { });

        act(() => {
            result.current.logout();
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(CURRENT_USER_KEY);
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(LEGACY_USER_KEY);
    });
});

describe("AuthContext — userRole", () => {
    it("extracts role from a User object", async () => {
        const user = buildUser({ role: "ADMIN" });
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === ACCESS_TOKEN_KEY) return "token";
            if (key === CURRENT_USER_KEY) return JSON.stringify(user);
            return null;
        });

        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => { });

        expect(result.current.userRole).toBe("ADMIN");
    });
});

describe("useAuth outside provider", () => {
    it("throws an error when called outside AuthProvider", () => {
        // Suppress React's console.error for this test
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });
        expect(() => {
            renderHook(() => useAuth());
        }).toThrow("useAuth must be used within an AuthProvider");
        consoleSpy.mockRestore();
    });
});

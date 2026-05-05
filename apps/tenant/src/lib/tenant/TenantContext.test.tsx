import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { getTenantFromHeaders } from "./server";
import { TenantProvider, useTenant } from "./TenantContext";
import type { Tenant } from "@gym/types";

const mocks = vi.hoisted(() => {
  return {
    headers: new Map<string, string>(),
    cookies: new Map<string, string>(),
  };
});

// Mock next/headers
vi.mock("next/headers", () => {
  return {
    headers: vi.fn(async () => ({
      get: (key: string) => mocks.headers.get(key) || null,
    })),
    cookies: vi.fn(async () => ({
      get: (key: string) => mocks.cookies.has(key) ? { value: mocks.cookies.get(key) } : null,
    })),
  };
});

describe("TenantContext Server and Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    mocks.headers.clear();
    mocks.cookies.clear();
  });

  describe("getTenantFromHeaders", () => {
    it("reads x-tenant-slug from headers and fetches correctly", async () => {
      const mockTenant: Tenant = {
        id: "1",
        name: "Alpha Gym",
        slug: "alpha",
        plan: "pro",
        isActive: true,
        domain: "alpha.gym-saas.app",
        createdAt: "2024-01-01",
        deletedAt: null
      };

      mocks.headers.set("x-tenant-slug", "alpha");
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockTenant })
      });

      const tenant = await getTenantFromHeaders();
      expect(tenant).toEqual(mockTenant);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/tenant/tenant/me"), expect.objectContaining({
        headers: expect.objectContaining({
          "x-tenant-id": "alpha"
        })
      }));
    });

    it("throws if no slug is in headers", async () => {
      await expect(getTenantFromHeaders()).rejects.toThrow("No tenant slug found in headers");
    });
  });

  describe("useTenant hook", () => {
    it("throws outside provider with descriptive message", () => {
      // Supress console.error from React about rendering error boundary
      const originalConsoleError = console.error;
      console.error = vi.fn();

      expect(() => renderHook(() => useTenant())).toThrow("useTenant must be used inside TenantProvider");

      console.error = originalConsoleError;
    });

    it("returns context value when wrapped in provider", () => {
      const mockTenant: Tenant = {
        id: "1",
        name: "Alpha Gym",
        slug: "alpha",
        plan: "pro",
        isActive: true,
        domain: "alpha.gym-saas.app",
        createdAt: "2024-01-01",
        deletedAt: null
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TenantProvider tenant={mockTenant}>{children}</TenantProvider>
      );

      const { result } = renderHook(() => useTenant(), { wrapper });
      expect(result.current).toEqual(mockTenant);
    });
  });
});

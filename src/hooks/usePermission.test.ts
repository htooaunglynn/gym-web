/**
 * Unit tests for usePermission hook
 * Validates: Requirements 3.7, 4.9, 5.4, 6.8, 7.8, 8.8, 9.9, 10.5, 11.8, 12.12, 13.8, 14.10
 */
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { RolePermission } from "@/contexts/AuthContext";
import type { AuthUser } from "@/contexts/AuthContext";

// ─── Mock AuthContext ─────────────────────────────────────────────────────────

const mockPermissions: RolePermission[] = [];
let mockUser: AuthUser | null = null;

vi.mock("@/contexts/AuthContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/contexts/AuthContext")>();
  return {
    ...actual,
    useAuth: () => ({
      user: mockUser,
      permissions: mockPermissions,
    }),
  };
});

function setPermissions(perms: RolePermission[]) {
  mockPermissions.length = 0;
  mockPermissions.push(...perms);
}

function setUser(
  user: AuthUser | null,
) {
  mockUser = user;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("usePermission", () => {
  it("returns false when permissions array is empty", async () => {
    setUser(null);
    setPermissions([]);
    const { usePermission } = await import("./usePermission");
    const { result } = renderHook(() => usePermission("USERS", "VIEW"));
    expect(result.current).toBe(false);
  });

  it("returns true when the feature+action is present", async () => {
    setUser(null);
    setPermissions([{ feature: "USERS", actions: ["VIEW", "CREATE_UPDATE"] }]);
    const { usePermission } = await import("./usePermission");
    const { result } = renderHook(() => usePermission("USERS", "VIEW"));
    expect(result.current).toBe(true);
  });

  it("returns false when feature is present but action is not", async () => {
    setUser(null);
    setPermissions([{ feature: "USERS", actions: ["VIEW"] }]);
    const { usePermission } = await import("./usePermission");
    const { result } = renderHook(() => usePermission("USERS", "DELETE"));
    expect(result.current).toBe(false);
  });

  it("returns false when a different feature has the action", async () => {
    setUser(null);
    setPermissions([{ feature: "MEMBERS", actions: ["VIEW", "DELETE"] }]);
    const { usePermission } = await import("./usePermission");
    const { result } = renderHook(() => usePermission("USERS", "DELETE"));
    expect(result.current).toBe(false);
  });

  it("returns true for MANAGE action when present", async () => {
    setUser(null);
    setPermissions([
      { feature: "ROLE_PERMISSIONS", actions: ["VIEW", "MANAGE"] },
    ]);
    const { usePermission } = await import("./usePermission");
    const { result } = renderHook(() =>
      usePermission("ROLE_PERMISSIONS", "MANAGE"),
    );
    expect(result.current).toBe(true);
  });

  it("handles multiple features correctly", async () => {
    setUser(null);
    setPermissions([
      { feature: "USERS", actions: ["VIEW"] },
      { feature: "MEMBERS", actions: ["VIEW", "CREATE_UPDATE", "DELETE"] },
      { feature: "EQUIPMENT", actions: ["VIEW"] },
    ]);
    const { usePermission } = await import("./usePermission");

    const { result: r1 } = renderHook(() => usePermission("USERS", "VIEW"));
    expect(r1.current).toBe(true);

    const { result: r2 } = renderHook(() => usePermission("MEMBERS", "DELETE"));
    expect(r2.current).toBe(true);

    const { result: r3 } = renderHook(() =>
      usePermission("EQUIPMENT", "DELETE"),
    );
    expect(r3.current).toBe(false);

    const { result: r4 } = renderHook(() => usePermission("TRAINERS", "VIEW"));
    expect(r4.current).toBe(false);
  });

  it("returns true for super admin without loading permissions", async () => {
    setUser({
      sub: "admin-1",
      email: "admin@gym.local",
      role: "ADMIN",
      globalRole: "ADMIN",
      branchId: "branch-1",
      isAdmin: true,
    });
    setPermissions([]);

    const { usePermission } = await import("./usePermission");
    const { result } = renderHook(() => usePermission("USERS", "DELETE"));

    expect(result.current).toBe(true);
  });

  it("returns true for branch admin built-in branch authority", async () => {
    setUser({
      sub: "branch-admin-1",
      email: "branch.admin@gym.local",
      role: "BRANCH_ADMIN",
      globalRole: "BRANCH_ADMIN",
      branchId: "branch-1",
      isAdmin: false,
    });
    setPermissions([]);

    const { usePermission } = await import("./usePermission");
    const { result } = renderHook(() =>
      usePermission("BRANCH_USER_ASSIGNMENTS", "MANAGE"),
    );

    expect(result.current).toBe(true);
  });

  it("does not grant branch admin global users access without permissions", async () => {
    setUser({
      sub: "branch-admin-2",
      email: "branch.admin2@gym.local",
      role: "BRANCH_ADMIN",
      globalRole: "BRANCH_ADMIN",
      branchId: "branch-1",
      isAdmin: false,
    });
    setPermissions([]);

    const { usePermission } = await import("./usePermission");
    const { result } = renderHook(() => usePermission("USERS", "VIEW"));

    expect(result.current).toBe(false);
  });
});

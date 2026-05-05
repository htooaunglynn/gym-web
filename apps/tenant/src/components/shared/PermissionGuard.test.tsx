/**
 * Unit tests for PermissionGuard component
 * Validates: Requirements 2.2, 2.6
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import type { RolePermission } from "@/contexts/AuthContext";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: mockReplace }),
}));

const mockShowToast = vi.fn();

vi.mock("@/contexts/ToastContext", () => ({
    useToast: () => ({ showToast: mockShowToast }),
}));

// Mutable permissions array — mutate in each test via setPermissions()
const mockPermissions: RolePermission[] = [];

vi.mock("@/hooks/usePermission", () => ({
    usePermission: (
        feature: RolePermission["feature"],
        requirement: RolePermission["actions"][number] | 0 | 1 | 2 | 3 | 4,
    ) =>
        mockPermissions.some(
            (p) =>
                p.feature === feature &&
                (typeof requirement === "string"
                    ? p.actions.includes(requirement)
                    : (p.permissionStage ?? 0) >= requirement),
        ),
}));

function setPermissions(perms: RolePermission[]) {
    mockPermissions.length = 0;
    mockPermissions.push(...perms);
}

// ─── Import component after mocks are set up ──────────────────────────────────

// Dynamic import is not needed here — vi.mock hoisting handles it.
import { PermissionGuard } from "./PermissionGuard";

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    vi.clearAllMocks();
    setPermissions([]);
});

describe("PermissionGuard – has permission", () => {
    it("renders children when the user has the required permission", () => {
        setPermissions([{ feature: "USERS", actions: ["VIEW"] }]);

        render(
            <PermissionGuard feature="USERS" action="VIEW">
                <span>Protected Content</span>
            </PermissionGuard>,
        );

        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("does not redirect when the user has permission", async () => {
        setPermissions([
            { feature: "MEMBERS", actions: ["VIEW", "CREATE_UPDATE"] },
        ]);

        render(
            <PermissionGuard feature="MEMBERS" action="CREATE_UPDATE">
                <span>Member Actions</span>
            </PermissionGuard>,
        );

        // Wait a tick to ensure no async side-effects fire
        await waitFor(() => {
            expect(mockReplace).not.toHaveBeenCalled();
        });
    });

    it("does not show an error toast when the user has permission", async () => {
        setPermissions([{ feature: "EQUIPMENT", actions: ["VIEW", "DELETE"] }]);

        render(
            <PermissionGuard feature="EQUIPMENT" action="DELETE">
                <span>Delete Button</span>
            </PermissionGuard>,
        );

        await waitFor(() => {
            expect(mockShowToast).not.toHaveBeenCalled();
        });
    });

    it("renders children when the user satisfies the required stage", () => {
        setPermissions([
            { feature: "MEMBERS", actions: ["VIEW", "CREATE_UPDATE"], permissionStage: 3 },
        ]);

        render(
            <PermissionGuard feature="MEMBERS" stage={3}>
                <span>Stage Protected Content</span>
            </PermissionGuard>,
        );

        expect(screen.getByText("Stage Protected Content")).toBeInTheDocument();
    });
});

describe("PermissionGuard – no permission, no fallback", () => {
    it("renders nothing (null) when permission is absent and no fallback is provided", () => {
        setPermissions([]);

        const { container } = render(
            <PermissionGuard feature="USERS" action="VIEW">
                <span>Secret Content</span>
            </PermissionGuard>,
        );

        expect(screen.queryByText("Secret Content")).not.toBeInTheDocument();
        expect(container.firstChild).toBeNull();
    });

    it("calls router.replace('/dashboard') when permission is absent and no fallback", async () => {
        setPermissions([]);

        render(
            <PermissionGuard feature="BRANCHES" action="VIEW">
                <span>Branch Page</span>
            </PermissionGuard>,
        );

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/dashboard");
        });
    });

    it("shows the 'no permission' error toast when permission is absent and no fallback", async () => {
        setPermissions([]);

        render(
            <PermissionGuard feature="ROLE_PERMISSIONS" action="MANAGE">
                <span>Permissions Matrix</span>
            </PermissionGuard>,
        );

        await waitFor(() => {
            expect(mockShowToast).toHaveBeenCalledWith(
                "You do not have permission to view this page",
                "error",
            );
        });
    });

    it("only shows the toast once even if the component re-renders", async () => {
        setPermissions([]);

        const { rerender } = render(
            <PermissionGuard feature="PRODUCTS" action="VIEW">
                <span>Products</span>
            </PermissionGuard>,
        );

        // Trigger a re-render
        rerender(
            <PermissionGuard feature="PRODUCTS" action="VIEW">
                <span>Products</span>
            </PermissionGuard>,
        );

        await waitFor(() => {
            expect(mockShowToast).toHaveBeenCalledTimes(1);
        });
    });
});

describe("PermissionGuard – no permission, with fallback prop", () => {
    it("renders the fallback node when permission is absent and fallback is provided", () => {
        setPermissions([]);

        render(
            <PermissionGuard
                feature="USERS"
                action="DELETE"
                fallback={<span>Access Denied</span>}
            >
                <span>Delete Button</span>
            </PermissionGuard>,
        );

        expect(screen.getByText("Access Denied")).toBeInTheDocument();
        expect(screen.queryByText("Delete Button")).not.toBeInTheDocument();
    });

    it("does NOT call router.replace when a fallback is provided", async () => {
        setPermissions([]);

        render(
            <PermissionGuard
                feature="MEMBERS"
                action="CREATE_UPDATE"
                fallback={<span>No Access</span>}
            >
                <span>Add Member</span>
            </PermissionGuard>,
        );

        await waitFor(() => {
            expect(mockReplace).not.toHaveBeenCalled();
        });
    });

    it("still shows the error toast when a fallback is provided", async () => {
        setPermissions([]);

        render(
            <PermissionGuard
                feature="TRAINERS"
                action="VIEW"
                fallback={<span>Fallback UI</span>}
            >
                <span>Trainers Page</span>
            </PermissionGuard>,
        );

        await waitFor(() => {
            expect(mockShowToast).toHaveBeenCalledWith(
                "You do not have permission to view this page",
                "error",
            );
        });
    });

    it("renders null fallback without crashing", () => {
        setPermissions([]);

        const { container } = render(
            <PermissionGuard
                feature="INVENTORY_MOVEMENTS"
                action="VIEW"
                fallback={null}
            >
                <span>Inventory</span>
            </PermissionGuard>,
        );

        expect(screen.queryByText("Inventory")).not.toBeInTheDocument();
        // fallback=null means the fallback branch renders <>{null}</> — container may be empty
        expect(container.textContent).toBe("");
    });
});

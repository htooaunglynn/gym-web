"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Info } from "lucide-react";
import {
  PermissionsMatrix,
  RolePermissionMatrix,
} from "@/components/dashboard/PermissionsMatrix";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import type {
  GlobalRole,
  PermissionFeature,
  PermissionAction,
  RolePermission,
} from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MyPermissionsResponse {
  permissions: RolePermission[];
}

// ─── Feature label map (for the read-only summary panel) ─────────────────────

const FEATURE_LABELS: Record<PermissionFeature, string> = {
  BRANCHES: "Branches",
  USERS: "Users",
  MEMBERS: "Members",
  TRAINERS: "Trainers",
  ATTENDANCE: "Attendance",
  EQUIPMENT: "Equipment",
  INVENTORY_MOVEMENTS: "Inventory Movements",
  MEMBERSHIP_PLANS: "Membership Plans",
  MEMBER_SUBSCRIPTIONS: "Member Subscriptions",
  PRODUCTS: "Products",
  PRODUCT_SALES: "Product Sales",
  ROLE_PERMISSIONS: "Role Permissions",
  BRANCH_USER_ASSIGNMENTS: "Branch User Assignments",
  SUBSCRIPTION_APPROVALS: "Subscription Approvals",
};

const ACTION_LABELS: Record<PermissionAction, string> = {
  VIEW: "View",
  CREATE_UPDATE: "Create/Edit",
  DELETE: "Delete",
  MANAGE: "Manage",
  APPROVE: "Approve",
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default function PermissionsPage() {
  const { activeBranchId } = useAuth();
  const { showToast } = useToast();

  // ── State ──────────────────────────────────────────────────────────────────
  const [roleMatrix, setRoleMatrix] = useState<RolePermissionMatrix[]>([]);
  const [myPermissions, setMyPermissions] = useState<RolePermission[]>([]);
  const [isLoadingMatrix, setIsLoadingMatrix] = useState(true);
  const [isLoadingMine, setIsLoadingMine] = useState(true);

  // ── Permissions ────────────────────────────────────────────────────────────
  const canManage = usePermission("ROLE_PERMISSIONS", "MANAGE");

  // ── Fetch role matrix ──────────────────────────────────────────────────────
  const fetchRoleMatrix = useCallback(async () => {
    setIsLoadingMatrix(true);
    try {
      const data = await apiClient<RolePermissionMatrix[]>(
        "/permissions/roles",
        {
          params: { branchId: activeBranchId },
        },
      );
      // Normalise: the API may return an array or an object keyed by role
      if (Array.isArray(data)) {
        setRoleMatrix(data);
      } else {
        // Convert object shape { ADMIN: [...], STAFF: [...] } to array
        const asArray = Object.entries(
          data as unknown as Record<string, RolePermission[]>,
        ).map(([role, permissions]) => ({
          role: role as GlobalRole,
          permissions,
        }));
        setRoleMatrix(asArray);
      }
    } catch {
      // apiClient handles toast
    } finally {
      setIsLoadingMatrix(false);
    }
  }, [activeBranchId]);

  // ── Fetch my permissions ───────────────────────────────────────────────────
  const fetchMyPermissions = useCallback(async () => {
    setIsLoadingMine(true);
    try {
      const data = await apiClient<MyPermissionsResponse>("/permissions/me", {
        params: { branchId: activeBranchId },
      });
      setMyPermissions(data.permissions ?? []);
    } catch {
      // apiClient handles toast
    } finally {
      setIsLoadingMine(false);
    }
  }, [activeBranchId]);

  // Re-fetch whenever activeBranchId changes (Requirement 14.7)
  useEffect(() => {
    fetchRoleMatrix();
    fetchMyPermissions();
  }, [fetchRoleMatrix, fetchMyPermissions]);

  // ── Save handler ───────────────────────────────────────────────────────────
  const handleSave = useCallback(
    async (role: GlobalRole, permissions: RolePermission[]) => {
      await apiClient(`/permissions/roles/${role}`, {
        method: "PUT",
        body: JSON.stringify({ permissions }),
        params: { branchId: activeBranchId },
      });
      showToast(`Permissions for ${role.replace(/_/g, " ")} saved.`, "success");
    },
    [activeBranchId, showToast],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PermissionGuard feature="ROLE_PERMISSIONS" action="VIEW">
      <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-tight">
              Permissions
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Configure role-based access control for each feature.
              {activeBranchId && (
                <span className="ml-1 text-[#435ee5]">
                  Branch: {activeBranchId}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm font-medium">
            <Info className="w-4 h-4 flex-shrink-0" />
            {canManage
              ? "Edit mode — changes are saved per role."
              : "Read-only view."}
          </div>
        </div>

        {/* My Permissions — read-only summary panel (Requirement 14.6) */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#435ee5]" />
            <h2 className="text-lg font-bold text-[#211922]">
              Your Permissions
            </h2>
          </div>

          {isLoadingMine ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-[#e5e5e0] animate-pulse"
                />
              ))}
            </div>
          ) : myPermissions.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No permissions assigned to your account for this branch.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {myPermissions.map((perm) => (
                <div
                  key={perm.feature}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <p className="text-xs font-bold text-[#211922] mb-2 uppercase tracking-wider">
                    {FEATURE_LABELS[perm.feature] ?? perm.feature}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {perm.actions.map((action: PermissionAction) => (
                      <span
                        key={action}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#435ee5]/10 text-[#435ee5]"
                      >
                        {ACTION_LABELS[action] ?? action}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Divider */}
        <hr className="border-gray-100 mb-10" />

        {/* Role Permissions Matrix (Requirement 14.2) */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-bold text-[#211922]">
              Role Permission Matrix
            </h2>
            {!canManage && (
              <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                Read-only
              </span>
            )}
          </div>

          {isLoadingMatrix ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl bg-[#e5e5e0] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <PermissionsMatrix
              roleMatrix={roleMatrix}
              activeBranchId={activeBranchId}
              onSave={handleSave}
              readOnly={!canManage}
            />
          )}
        </section>
      </div>
    </PermissionGuard>
  );
}

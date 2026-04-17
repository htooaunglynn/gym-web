"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import type {
  GlobalRole,
  PermissionFeature,
  PermissionAction,
  RolePermission,
} from "@/contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RolePermissionMatrix {
  role: GlobalRole;
  permissions: RolePermission[];
}

export interface PermissionsMatrixProps {
  roleMatrix: RolePermissionMatrix[];
  activeBranchId: string | null;
  onSave: (role: GlobalRole, permissions: RolePermission[]) => Promise<void>;
  readOnly?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_FEATURES: PermissionFeature[] = [
  "BRANCHES",
  "USERS",
  "MEMBERS",
  "TRAINERS",
  "ATTENDANCE",
  "EQUIPMENT",
  "INVENTORY_MOVEMENTS",
  "MEMBERSHIP_PLANS",
  "MEMBER_SUBSCRIPTIONS",
  "PRODUCTS",
  "PRODUCT_SALES",
  "ROLE_PERMISSIONS",
  "BRANCH_USER_ASSIGNMENTS",
  "SUBSCRIPTION_APPROVALS",
];

const ALL_ACTIONS: PermissionAction[] = [
  "VIEW",
  "CREATE_UPDATE",
  "DELETE",
  "MANAGE",
  "APPROVE",
];

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a lookup map: feature → set of actions */
function buildPermissionMap(
  permissions: RolePermission[],
): Map<PermissionFeature, Set<PermissionAction>> {
  const map = new Map<PermissionFeature, Set<PermissionAction>>();
  for (const p of permissions) {
    map.set(p.feature, new Set(p.actions));
  }
  return map;
}

/** Convert a permission map back to a RolePermission array */
function permissionMapToArray(
  map: Map<PermissionFeature, Set<PermissionAction>>,
): RolePermission[] {
  const result: RolePermission[] = [];
  for (const [feature, actions] of map.entries()) {
    if (actions.size > 0) {
      result.push({ feature, actions: Array.from(actions) });
    }
  }
  return result;
}

// ─── Sub-component: single role column state ──────────────────────────────────

interface RoleColumnState {
  role: GlobalRole;
  permMap: Map<PermissionFeature, Set<PermissionAction>>;
  isSaving: boolean;
  isDirty: boolean;
}

type RoleLocalState = Omit<RoleColumnState, "role">;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * PermissionsMatrix renders a table where:
 *   - Rows = PermissionFeature values
 *   - Columns = roles (from roleMatrix)
 *   - Each cell = checkboxes for each PermissionAction
 *
 * Supports optimistic updates: toggling a checkbox updates local state
 * immediately. On save failure the state is reverted.
 *
 * Requirements: 14.2, 14.3, 14.4, 14.5
 */
export function PermissionsMatrix({
  roleMatrix,
  activeBranchId,
  onSave,
  readOnly = false,
}: PermissionsMatrixProps) {
  void activeBranchId;

  // Keep only per-role overrides in state. Base values are always derived from props.
  const [roleStateByRole, setRoleStateByRole] = useState<
    Partial<Record<GlobalRole, RoleLocalState>>
  >({});

  const columns = useMemo<RoleColumnState[]>(
    () =>
      roleMatrix.map((rm) => {
        const state = roleStateByRole[rm.role];
        return {
          role: rm.role,
          permMap: state?.permMap ?? buildPermissionMap(rm.permissions),
          isSaving: state?.isSaving ?? false,
          isDirty: state?.isDirty ?? false,
        };
      }),
    [roleMatrix, roleStateByRole],
  );

  // ── Toggle a single checkbox ───────────────────────────────────────────────
  const handleToggle = useCallback(
    (
      roleIndex: number,
      feature: PermissionFeature,
      action: PermissionAction,
    ) => {
      if (readOnly) return;

      const col = columns[roleIndex];
      if (!col) return;

      // Deep-clone the map so we don't mutate the previous state
      const newMap = new Map(
        Array.from(col.permMap.entries()).map(([f, a]) => [f, new Set(a)]),
      );

      const actions = newMap.get(feature) ?? new Set<PermissionAction>();
      if (actions.has(action)) {
        actions.delete(action);
      } else {
        actions.add(action);
      }
      newMap.set(feature, actions);

      setRoleStateByRole((prev) => ({
        ...prev,
        [col.role]: {
          permMap: newMap,
          isSaving: false,
          isDirty: true,
        },
      }));
    },
    [columns, readOnly],
  );

  // ── Save a role column ─────────────────────────────────────────────────────
  const handleSave = useCallback(
    async (roleIndex: number) => {
      const col = columns[roleIndex];
      if (!col || col.isSaving) return;

      // Snapshot current state for potential rollback
      const snapshot = new Map(
        Array.from(col.permMap.entries()).map(([f, a]) => [f, new Set(a)]),
      );

      // Mark as saving
      setRoleStateByRole((prev) => ({
        ...prev,
        [col.role]: {
          permMap: col.permMap,
          isSaving: true,
          isDirty: col.isDirty,
        },
      }));

      try {
        const permissions = permissionMapToArray(col.permMap);
        await onSave(col.role, permissions);

        // Mark as saved (no longer dirty)
        setRoleStateByRole((prev) => ({
          ...prev,
          [col.role]: {
            permMap: col.permMap,
            isSaving: false,
            isDirty: false,
          },
        }));
      } catch {
        // Revert optimistic update on failure
        setRoleStateByRole((prev) => ({
          ...prev,
          [col.role]: {
            permMap: snapshot,
            isSaving: false,
            isDirty: false,
          },
        }));
      }
    },
    [columns, onSave],
  );

  if (columns.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        No role data available.
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm border-collapse">
        {/* ── Header ── */}
        <thead>
          <tr className="bg-[#f8f9fa] border-b border-gray-100">
            {/* Feature column header */}
            <th className="text-left px-5 py-4 font-bold text-[#211922] text-xs uppercase tracking-wider w-52 sticky left-0 bg-[#f8f9fa] z-10">
              Feature / Permission
            </th>

            {/* One column per role */}
            {columns.map((col, roleIndex) => (
              <th
                key={col.role}
                className="px-4 py-4 text-center min-w-[180px]"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="font-bold text-[#211922] text-xs uppercase tracking-wider">
                    {col.role.replace(/_/g, " ")}
                  </span>

                  {/* Action labels row */}
                  <div className="flex gap-1 justify-center">
                    {ALL_ACTIONS.map((action) => (
                      <span
                        key={action}
                        title={ACTION_LABELS[action]}
                        className="text-[10px] text-gray-400 font-medium w-14 text-center leading-tight"
                      >
                        {ACTION_LABELS[action]}
                      </span>
                    ))}
                  </div>

                  {/* Save button (only in edit mode) */}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleSave(roleIndex)}
                      disabled={col.isSaving || !col.isDirty}
                      aria-label={`Save changes for ${col.role}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        col.isDirty && !col.isSaving
                          ? "bg-[#e60023] text-white hover:bg-[#c4001f] shadow-sm shadow-[#e60023]/20"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#435ee5]`}
                    >
                      {col.isSaving ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3" />
                          Save
                        </>
                      )}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {ALL_FEATURES.map((feature, featureIndex) => (
            <tr
              key={feature}
              className={`border-b border-gray-50 transition-colors ${
                featureIndex % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
              } hover:bg-blue-50/30`}
            >
              {/* Feature label */}
              <td className="px-5 py-3 font-medium text-[#211922] text-sm sticky left-0 bg-inherit z-10">
                {FEATURE_LABELS[feature]}
              </td>

              {/* Checkboxes per role */}
              {columns.map((col, roleIndex) => {
                const featureActions =
                  col.permMap.get(feature) ?? new Set<PermissionAction>();

                return (
                  <td key={col.role} className="px-4 py-3">
                    <div className="flex gap-1 justify-center">
                      {ALL_ACTIONS.map((action) => {
                        const checked = featureActions.has(action);
                        const id = `perm-${col.role}-${feature}-${action}`;

                        return (
                          <div
                            key={action}
                            className="flex items-center justify-center w-14"
                          >
                            <input
                              id={id}
                              type="checkbox"
                              checked={checked}
                              disabled={readOnly || col.isSaving}
                              onChange={() =>
                                handleToggle(roleIndex, feature, action)
                              }
                              aria-label={`${ACTION_LABELS[action]} permission for ${FEATURE_LABELS[feature]} — ${col.role}`}
                              className="w-4 h-4 rounded border-[#91918c] text-[#e60023] accent-[#e60023] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#435ee5]"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

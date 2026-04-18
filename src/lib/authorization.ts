import type {
  AuthUser,
  PermissionAction,
  PermissionFeature,
  RolePermission,
} from "@/contexts/AuthContext";

const BRANCH_ADMIN_AUTHORITY: Partial<
  Record<PermissionFeature, PermissionAction[]>
> = {
  BRANCHES: ["VIEW", "CREATE_UPDATE"],
  MEMBERS: ["VIEW", "CREATE_UPDATE", "DELETE"],
  TRAINERS: ["VIEW", "CREATE_UPDATE", "DELETE"],
  ATTENDANCE: ["VIEW", "CREATE_UPDATE", "DELETE"],
  EQUIPMENT: ["VIEW", "CREATE_UPDATE", "DELETE"],
  INVENTORY_MOVEMENTS: ["VIEW", "CREATE_UPDATE", "DELETE"],
  MEMBERSHIP_PLANS: ["VIEW", "CREATE_UPDATE", "DELETE"],
  MEMBER_SUBSCRIPTIONS: ["VIEW", "CREATE_UPDATE", "DELETE"],
  PRODUCTS: ["VIEW", "CREATE_UPDATE", "DELETE"],
  PRODUCT_SALES: ["VIEW", "CREATE_UPDATE", "DELETE"],
  BRANCH_USER_ASSIGNMENTS: ["VIEW", "MANAGE"],
  SUBSCRIPTION_APPROVALS: ["APPROVE"],
};

export function hasAuthority(
  user: AuthUser | null,
  permissions: RolePermission[],
  feature: PermissionFeature,
  action: PermissionAction,
): boolean {
  if (user?.isAdmin) {
    return true;
  }

  if (user?.globalRole === "BRANCH_ADMIN") {
    const builtInActions = BRANCH_ADMIN_AUTHORITY[feature] ?? [];
    if (builtInActions.includes(action)) {
      return true;
    }
  }

  return permissions.some(
    (permission) =>
      permission.feature === feature && permission.actions.includes(action),
  );
}

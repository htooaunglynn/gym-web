import type {
    AuthUser,
    PermissionAction,
    PermissionFeature,
    PermissionStage,
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

function getPermissionStage(actions: PermissionAction[]): PermissionStage {
    if (actions.includes("DELETE")) {
        return 4;
    }

    if (actions.includes("CREATE_UPDATE")) {
        return 3;
    }

    if (actions.includes("VIEW")) {
        return 1;
    }

    return 0;
}

function hasRequiredStage(
    actions: PermissionAction[],
    requiredStage: PermissionStage,
): boolean {
    return getPermissionStage(actions) >= requiredStage;
}

export function hasAuthority(
    user: AuthUser | null,
    permissions: RolePermission[],
    feature: PermissionFeature,
    requirement: PermissionAction | PermissionStage,
): boolean {
    if (user?.isAdmin) {
        return true;
    }

    if (user?.globalRole === "BRANCH_ADMIN") {
        const builtInActions = BRANCH_ADMIN_AUTHORITY[feature] ?? [];
        if (
            typeof requirement === "string"
                ? builtInActions.includes(requirement)
                : hasRequiredStage(builtInActions, requirement)
        ) {
            return true;
        }
    }

    return permissions.some((permission) => {
        if (permission.feature !== feature) {
            return false;
        }

        if (typeof requirement === "string") {
            return permission.actions.includes(requirement);
        }

        return (
            (permission.permissionStage ?? getPermissionStage(permission.actions)) >=
            requirement
        );
    });
}

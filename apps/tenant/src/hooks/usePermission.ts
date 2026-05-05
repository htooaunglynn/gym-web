"use client";

import { useAuth } from "@/contexts/AuthContext";
import type {
    PermissionAction,
    PermissionFeature,
    PermissionStage,
} from "@/contexts/AuthContext";
import { hasAuthority } from "@/lib/authorization";

/**
 * Returns true if the current user has the given feature + action/stage permission.
 * Reads the permission matrix stored in AuthContext (fetched from GET /permissions/me).
 */
export function usePermission(
    feature: PermissionFeature,
    requirement: PermissionAction | PermissionStage,
): boolean {
    const { user, permissions } = useAuth();

    return hasAuthority(user, permissions, feature, requirement);
}

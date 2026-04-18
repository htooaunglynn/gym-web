"use client";

import { useAuth } from "@/contexts/AuthContext";
import type {
    PermissionFeature,
    PermissionAction,
} from "@/contexts/AuthContext";

/**
 * Returns true if the current user has the given feature + action permission.
 * Reads the permission matrix stored in AuthContext (fetched from GET /permissions/me).
 */
export function usePermission(
    feature: PermissionFeature,
    action: PermissionAction,
): boolean {
    const { permissions } = useAuth();

    return permissions.some(
        (p) => p.feature === feature && p.actions.includes(action),
    );
}

"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type {
    PermissionAction,
    PermissionFeature,
    PermissionStage,
} from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { useToast } from "@/contexts/ToastContext";

type ActionPermissionGuardProps = {
    feature: PermissionFeature;
    action: PermissionAction;
    stage?: never;
    /** Custom fallback. Defaults to redirect to /dashboard with a toast. */
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

type StagePermissionGuardProps = {
    feature: PermissionFeature;
    stage: PermissionStage;
    action?: never;
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

export type PermissionGuardProps =
    | ActionPermissionGuardProps
    | StagePermissionGuardProps;

/**
 * Wraps page content with a permission check.
 * If the user lacks the required permission, renders `fallback` (or redirects
 * to /dashboard) and shows a "You do not have permission to view this page" toast.
 *
 * Uses useRouter().replace() for client-side navigation instead of the
 * server-only redirect() function, since this is a "use client" component.
 */
export function PermissionGuard({
    feature,
    action,
    stage,
    fallback,
    children,
}: PermissionGuardProps) {
    const hasPermission = usePermission(feature, action ?? stage);
    const { showToast } = useToast();
    const router = useRouter();
    const toastShownRef = useRef(false);

    // Show toast and redirect once when permission is denied and no custom fallback
    useEffect(() => {
        if (!hasPermission && !toastShownRef.current) {
            toastShownRef.current = true;
            showToast("You do not have permission to view this page", "error");
            if (fallback === undefined) {
                router.replace("/dashboard");
            }
        }
    }, [hasPermission, showToast, fallback, router]);

    if (!hasPermission) {
        if (fallback !== undefined) {
            return <>{fallback}</>;
        }
        // Render nothing while the useEffect redirect fires
        return null;
    }

    return <>{children}</>;
}

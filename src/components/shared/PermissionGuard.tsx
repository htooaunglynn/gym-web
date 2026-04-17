"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type {
  PermissionFeature,
  PermissionAction,
} from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { useToast } from "@/contexts/ToastContext";

export interface PermissionGuardProps {
  feature: PermissionFeature;
  action: PermissionAction;
  /** Custom fallback. Defaults to redirect to /dashboard with a toast. */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

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
  fallback,
  children,
}: PermissionGuardProps) {
  const hasPermission = usePermission(feature, action);
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

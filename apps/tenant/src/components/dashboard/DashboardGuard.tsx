"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Client component that enforces auth guard for the dashboard.
 * Redirects to /login if no valid token is found.
 */
export function DashboardGuard({ children }: { children: React.ReactNode }) {
  useAuthGuard();
  return <>{children}</>;
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCentralAuth } from "@/contexts/CentralAuthContext";
import { CentralSidebar } from "@/components/layout/CentralSidebar";
import { CentralTopHeader } from "@/components/layout/CentralTopHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isHydrated } = useCentralAuth();
  const router = useRouter();

  // While hydrating, show nothing to prevent flash
  if (!isHydrated) {
    return null;
  }

  // Client-side guard — middleware handles the server-side redirect
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f13]">
      <CentralSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <CentralTopHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

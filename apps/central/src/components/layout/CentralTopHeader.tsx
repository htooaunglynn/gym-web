"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCentralAuth } from "@/contexts/CentralAuthContext";
import { setAccessToken } from "@/lib/api/client";
import { LogOut, User } from "lucide-react";

export function CentralTopHeader() {
  const { user, clearSession } = useCentralAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Ask backend to clear the httpOnly refresh cookie
      await fetch("/api/central/auth/logout", { method: "POST" });
    } catch {
      // Best-effort
    }
    clearSession();
    setAccessToken(null);
    router.push("/login");
  };

  return (
    <header className="h-14 flex-shrink-0 bg-[#1a1a22] border-b border-[#2e2e3e] flex items-center justify-between px-6">
      <div />

      {/* User menu */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-[#9898b0]">
          <User className="w-4 h-4" />
          <span className="font-medium text-[#f1f1f4]">{user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          className="p-2 rounded-xl text-[#9898b0] hover:text-[#e84c4c] hover:bg-[#e84c4c]/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

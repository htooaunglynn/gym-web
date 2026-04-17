"use client";

import { Search, Bell, Info, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { BranchSwitcher } from "@/components/dashboard/BranchSwitcher";

export function TopHeader() {
  const { user } = useAuth();

  // Derive display values from live auth state
  const displayName = user ? `${user.email.split("@")[0]}` : "—";
  const displayEmail = user?.email ?? "—";
  const displayRole = user?.globalRole ?? "";

  return (
    <header className="w-full h-24 flex items-center justify-between px-8 bg-[#F8F9FA] border-b border-[#e5e5e0]">
      {/* Pills Navigation */}
      <div className="flex items-center bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
        <Link
          href="/dashboard"
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full shadow-md"
        >
          Overview
        </Link>
        <Link
          href="/dashboard/activity"
          className="px-6 py-2.5 text-gray-500 hover:text-gray-900 text-sm font-medium rounded-full transition-colors"
        >
          Activity
        </Link>
        <Link
          href="/dashboard/manage"
          className="px-6 py-2.5 text-gray-500 hover:text-gray-900 text-sm font-medium rounded-full transition-colors"
        >
          Manage
        </Link>
        <Link
          href="/dashboard/programs"
          className="px-6 py-2.5 text-gray-500 hover:text-gray-900 text-sm font-medium rounded-full transition-colors"
        >
          Programs
        </Link>
        <Link
          href="/dashboard/account"
          className="px-6 py-2.5 text-gray-500 hover:text-gray-900 text-sm font-medium rounded-full transition-colors"
        >
          Account
        </Link>
        <Link
          href="/dashboard/reports"
          className="px-6 py-2.5 text-gray-500 hover:text-gray-900 text-sm font-medium rounded-full transition-colors"
        >
          Reports
        </Link>
      </div>

      {/* Right Side Tools & Profile */}
      <div className="flex items-center gap-4">
        {/* Branch Switcher — only rendered for ADMIN users (BranchSwitcher returns null otherwise) */}
        <BranchSwitcher />

        {/* Actions Group */}
        <div className="flex items-center gap-2 bg-white rounded-full p-2 px-3 shadow-sm border border-gray-100">
          <button
            aria-label="Search"
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Search className="w-5 h-5 pointer-events-none" />
          </button>
          <button
            aria-label="Notifications"
            className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2 w-2 h-2 bg-[#FF5C39] border border-white rounded-full" />
          </button>
          <button
            aria-label="Information"
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Dropdown — wired to live auth state */}
        <button className="flex items-center gap-3 bg-white rounded-full p-2 pr-4 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors text-left">
          <div className="w-10 h-10 relative overflow-hidden rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
            {user ? (
              <span className="text-sm font-bold text-gray-600 uppercase select-none">
                {user.email.charAt(0)}
              </span>
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop"
                alt="Profile"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-tight">
              {displayName}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {displayEmail}
            </span>
            {displayRole && (
              <span className="text-xs text-[#62625b] font-medium">
                {displayRole}
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
        </button>
      </div>
    </header>
  );
}

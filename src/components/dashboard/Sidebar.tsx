"use client";

import Link from "next/link";
import { Dumbbell, LayoutDashboard, Users, UserCog, Calendar, Package, Settings, LogOut, HelpCircle } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-20 md:w-24 fixed left-0 top-0 h-screen bg-[#F8F9FA] flex flex-col items-center py-6 border-r border-gray-200 z-50">
      {/* Brand Icon replacing Finexy logo */}
      <Link href="/dashboard" className="w-12 h-12 bg-[#FF5C39] rounded-xl flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity mb-10 text-white">
        <Dumbbell className="w-6 h-6" />
      </Link>

      {/* Main Nav Icons */}
      <nav className="flex flex-col gap-6 w-full items-center flex-1">
        <Link href="/dashboard" className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-md">
          <LayoutDashboard className="w-5 h-5" />
        </Link>
        <Link href="/dashboard/members" className="w-12 h-12 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
          <Users className="w-5 h-5" />
        </Link>
        <Link href="/dashboard/trainers" className="w-12 h-12 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
          <UserCog className="w-5 h-5" />
        </Link>
        <Link href="/dashboard/attendance" className="w-12 h-12 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
          <Calendar className="w-5 h-5" />
        </Link>
        <Link href="/dashboard/equipment" className="w-12 h-12 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
          <Package className="w-5 h-5" />
        </Link>
        <Link href="/dashboard/settings" className="w-12 h-12 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
          <Settings className="w-5 h-5" />
        </Link>
      </nav>

      {/* Bottom Nav Icons */}
      <div className="flex flex-col gap-4 mt-auto">
        <button aria-label="Help" className="w-10 h-10 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button aria-label="Log Out" onClick={() => window.location.href = '/login'} className="w-10 h-10 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}

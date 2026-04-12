"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Dumbbell, 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Calendar, 
  Package, 
  Settings, 
  LogOut, 
  HelpCircle,
  Shield,
  Box
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/users", icon: Shield, label: "Users" },
    { href: "/dashboard/members", icon: Users, label: "Members" },
    { href: "/dashboard/trainers", icon: UserCog, label: "Trainers" },
    { href: "/dashboard/equipment", icon: Package, label: "Equipment" },
    { href: "/dashboard/inventory", icon: Box, label: "Inventory" },
    { href: "/dashboard/attendance", icon: Calendar, label: "Attendance" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-20 md:w-24 fixed left-0 top-0 h-screen bg-[#F8F9FA] flex flex-col items-center py-6 border-r border-gray-200 z-50">
      {/* Brand Icon replacing Finexy logo */}
      <Link href="/dashboard" className="w-12 h-12 bg-[#FF5C39] rounded-xl flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity mb-10 text-white">
        <Dumbbell className="w-6 h-6" />
      </Link>

      {/* Main Nav Icons */}
      <nav className="flex flex-col gap-6 w-full items-center flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              title={item.label}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 ${
                isActive 
                  ? "bg-gray-900 text-white shadow-md scale-105" 
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav Icons */}
      <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-200/60 w-full items-center">
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

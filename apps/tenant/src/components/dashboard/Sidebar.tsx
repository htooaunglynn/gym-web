"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dumbbell,
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  LogOut,
  HelpCircle,
  Shield,
  Box,
  CreditCard,
  Store,
  ShoppingCart,
  GitBranch,
  Lock,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import type { PermissionFeature } from "@/contexts/AuthContext";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  /** If set, the item is only shown when the user has VIEW permission for this feature */
  feature?: PermissionFeature;
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  // usePermission must be called unconditionally (Rules of Hooks).
  // When item.feature is undefined the result is ignored below.
  const hasPermission = usePermission(item.feature ?? "USERS", "VIEW");

  // Items without a feature guard are always visible (e.g. Dashboard overview)
  if (item.feature !== undefined && !hasPermission) {
    return null;
  }

  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
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
}

export function Sidebar() {
  const { logout } = useAuth();

  const navItems: NavItem[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      href: "/dashboard/users",
      icon: Shield,
      label: "Users",
      feature: "USERS",
    },
    {
      href: "/dashboard/branches",
      icon: GitBranch,
      label: "Branches",
      feature: "BRANCHES",
    },
    {
      href: "/dashboard/permissions",
      icon: Lock,
      label: "Permissions",
      feature: "ROLE_PERMISSIONS",
    },
    {
      href: "/dashboard/trainers",
      icon: UserCog,
      label: "Trainers",
      feature: "TRAINERS",
    },
    {
      href: "/dashboard/members",
      icon: Users,
      label: "Members",
      feature: "MEMBERS",
    },
    {
      href: "/dashboard/equipment",
      icon: Package,
      label: "Equipment",
      feature: "EQUIPMENT",
    },
    {
      href: "/dashboard/inventory",
      icon: Box,
      label: "Inventory",
      feature: "INVENTORY_MOVEMENTS",
    },
    {
      href: "/dashboard/plans",
      icon: CreditCard,
      label: "Membership Plans",
      feature: "MEMBERSHIP_PLANS",
    },
    {
      href: "/dashboard/subscriptions",
      icon: ClipboardList,
      label: "Subscriptions",
      feature: "MEMBER_SUBSCRIPTIONS",
    },
    {
      href: "/dashboard/products",
      icon: Store,
      label: "Products",
      feature: "PRODUCTS",
    },
    {
      href: "/dashboard/sales",
      icon: ShoppingCart,
      label: "Sales",
      feature: "PRODUCT_SALES",
    },
  ];

  return (
    <aside className="w-20 md:w-24 fixed left-0 top-0 h-screen bg-[#F8F9FA] flex flex-col items-center py-6 border-r border-gray-200 z-50">
      {/* Brand Icon */}
      <Link
        href="/dashboard"
        className="w-12 h-12 bg-[#FF5C39] rounded-xl flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity mb-10 text-white"
      >
        <Dumbbell className="w-6 h-6" />
      </Link>

      {/* Main Nav Icons */}
      <nav
        className="flex flex-col gap-6 w-full items-center flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-6"
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Nav Icons */}
      <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-200/60 w-full items-center">
        <button
          aria-label="Help"
          className="w-10 h-10 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          aria-label="Log Out"
          onClick={logout}
          className="w-10 h-10 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Package,
  Users,
  ScrollText,
  Activity,
  Wrench,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview",     href: "/overview",    icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Tenants",      href: "/tenants",     icon: <Building2 className="w-4 h-4" /> },
  { label: "Billing",      href: "/billing",     icon: <CreditCard className="w-4 h-4" /> },
  { label: "Plans",        href: "/plans",       icon: <Package className="w-4 h-4" /> },
  { label: "Users",        href: "/users",       icon: <Users className="w-4 h-4" /> },
  { label: "Audit Logs",   href: "/audit-logs",  icon: <ScrollText className="w-4 h-4" /> },
  { label: "Monitoring",   href: "/monitoring",  icon: <Activity className="w-4 h-4" /> },
  { label: "Maintenance",  href: "/maintenance", icon: <Wrench className="w-4 h-4" /> },
];

export function CentralSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#1a1a22] border-r border-[#2e2e3e] flex flex-col h-full">
      {/* Wordmark */}
      <div className="px-6 py-5 border-b border-[#2e2e3e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#6c63ff]/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#6c63ff]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#f1f1f4] leading-none">Gym SaaS</p>
            <p className="text-[10px] text-[#9898b0] mt-0.5 uppercase tracking-wider">Central Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/overview"
              ? pathname === "/overview" || pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#6c63ff]/20 text-[#6c63ff]"
                  : "text-[#9898b0] hover:text-[#f1f1f4] hover:bg-[#22222e]",
              ].join(" ")}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="px-6 py-4 border-t border-[#2e2e3e]">
        <p className="text-[10px] text-[#9898b0] uppercase tracking-wider">
          central.gym-saas.app
        </p>
      </div>
    </aside>
  );
}

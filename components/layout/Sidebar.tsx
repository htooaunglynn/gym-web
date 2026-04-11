"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊", roles: ["ADMIN", "STAFF", "TRAINER", "MEMBER"] },
    { href: "/members", label: "Members", icon: "👥", roles: ["ADMIN", "STAFF"] },
    { href: "/trainers", label: "Trainers", icon: "💪", roles: ["ADMIN", "STAFF"] },
    { href: "/equipment", label: "Equipment", icon: "🏋️", roles: ["ADMIN", "STAFF"] },
    { href: "/attendance", label: "Attendance", icon: "📝", roles: ["ADMIN", "STAFF", "TRAINER"] },
    { href: "/inventory", label: "Inventory", icon: "📦", roles: ["ADMIN", "STAFF"] },
    { href: "/payments", label: "Payments", icon: "💳", roles: ["ADMIN", "STAFF"] },
    { href: "/schedule", label: "Schedule", icon: "📅", roles: ["ADMIN", "STAFF", "TRAINER"] },
    { href: "/leave", label: "Leave", icon: "🌴", roles: ["ADMIN", "STAFF", "TRAINER"] },
    { href: "/performance", label: "Performance", icon: "📈", roles: ["ADMIN", "STAFF", "TRAINER"] },
    { href: "/payroll", label: "Payroll", icon: "🧾", roles: ["ADMIN", "STAFF"] },
    { href: "/recruitment", label: "Recruitment", icon: "🎯", roles: ["ADMIN", "STAFF", "HR"] },
    { href: "/inbox", label: "Inbox", icon: "✉️", roles: ["ADMIN", "STAFF", "TRAINER", "MEMBER"] },
];

export function Sidebar() {
    const pathname = usePathname();
    const { userRole } = useAuth();
    const [isOpen, setIsOpen] = useState(true);

    const filteredItems = navItems.filter((item) => item.roles.includes(userRole || "MEMBER"));

    return (
        <aside
            className={`
        bg-surface-container-low border-r border-border
        transition-all duration-300
        hidden md:flex
        ${isOpen ? "w-64" : "w-20"}
        h-[calc(100vh-73px)] sticky top-[73px] flex-col
      `}
            aria-label="Sidebar navigation"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 hover:bg-surface-container transition-default focus-ring"
                aria-label="Toggle sidebar"
                aria-expanded={isOpen}
            >
                <svg className="w-6 h-6 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-md
                transition-default
                focus-ring
                ${isActive
                                    ? "bg-primary text-on-primary"
                                    : "text-on-surface hover:bg-surface-container"
                                }
              `}
                            title={item.label}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {isOpen && <span className="text-body-md font-semibold">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

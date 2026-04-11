"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
    const pathname = usePathname();
    const { user, userRole, logout } = useAuth();

    const mobileNavItems = [
        { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "STAFF", "TRAINER", "MEMBER"] },
        { href: "/members", label: "Members", roles: ["ADMIN", "STAFF"] },
        { href: "/attendance", label: "Attendance", roles: ["ADMIN", "STAFF", "TRAINER"] },
        { href: "/payments", label: "Payments", roles: ["ADMIN", "STAFF"] },
    ].filter((item) => item.roles.includes(userRole || "MEMBER"));

    const userInitials = user
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
        : "?";

    return (
        <header className="bg-surface-container-lowest border-b border-border sticky top-0 z-40 shadow-ambient">
            <div className="px-4 md:px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <h1 className="title-md font-bold text-on-surface">GymHub</h1>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <div className="flex items-center gap-3">
                        <Avatar initials={userInitials} size="md" />
                        <div className="hidden sm:flex flex-col">
                            {user && (
                                <>
                                    <p className="text-body-md font-semibold text-on-surface">
                                        {user.firstName}
                                    </p>
                                    <p className="text-label-md text-on-surface-variant">
                                        {"role" in user ? user.role : "Member"}
                                    </p>
                                </>
                            )}
                        </div>

                        <Button
                            variant="tertiary"
                            size="sm"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <nav className="md:hidden border-t border-border px-3 py-2 overflow-x-auto" aria-label="Mobile navigation">
                <div className="flex items-center gap-2 min-w-max">
                    {mobileNavItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-1.5 rounded-md text-label-md transition-default ${isActive ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-container"
                                    }`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
}

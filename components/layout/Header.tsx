"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
    const { user, logout } = useAuth();

    const userInitials = user
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
        : "?";

    return (
        <header className="bg-surface-container-lowest border-b border-border sticky top-0 z-40 shadow-ambient">
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="title-md font-bold text-on-surface">GymHub</h1>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <div className="flex items-center gap-3">
                        <Avatar initials={userInitials} size="md" />
                        <div className="flex flex-col">
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
        </header>
    );
}

"use client";

import React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card } from "@/components/shared/Card";
import { RoleGate } from "@/components/shared/RoleGate";
import { ROUTES } from "@/config/routes";
import { UserRole } from "@/types/auth";

const routeRoleMap: Array<{ prefix: string; roles: UserRole[] }> = [
    { prefix: "/dashboard", roles: ["ADMIN", "STAFF", "TRAINER", "MEMBER", "HR"] },
    { prefix: "/members", roles: ["ADMIN", "STAFF", "TRAINER"] },
    { prefix: "/trainers", roles: ["ADMIN", "STAFF"] },
    { prefix: "/equipment", roles: ["ADMIN", "STAFF"] },
    { prefix: "/attendance", roles: ["ADMIN", "STAFF", "TRAINER"] },
    { prefix: "/inventory", roles: ["ADMIN", "STAFF"] },
    { prefix: "/payments", roles: ["ADMIN", "STAFF"] },
    { prefix: "/schedule", roles: ["ADMIN", "STAFF", "TRAINER"] },
    { prefix: "/leave", roles: ["ADMIN", "STAFF", "TRAINER"] },
    { prefix: "/performance", roles: ["ADMIN", "STAFF", "TRAINER"] },
    { prefix: "/payroll", roles: ["ADMIN", "STAFF"] },
    { prefix: "/recruitment", roles: ["ADMIN", "STAFF", "HR"] },
    { prefix: "/inbox", roles: ["ADMIN", "STAFF", "TRAINER", "MEMBER", "HR"] },
];

function getRouteRoles(pathname: string): UserRole[] {
    const matched = routeRoleMap.find((item) => pathname.startsWith(item.prefix));
    return matched?.roles ?? ["ADMIN", "STAFF", "TRAINER", "MEMBER", "HR"];
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isLoading, isAuthenticated, userRole } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace(ROUTES.LOGIN);
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <LoadingSpinner text="Checking access..." />
            </div>
        );
    }

    const allowedRoles = getRouteRoles(pathname);

    return (
        <div className="bg-surface min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                    <div className="p-4 md:p-6">
                        <RoleGate
                            roles={allowedRoles}
                            fallback={
                                <Card variant="outlined">
                                    <h2 className="title-md text-on-surface mb-2">Access Restricted</h2>
                                    <p className="text-body-md text-on-surface-variant">
                                        Your current role ({userRole}) does not have access to this module.
                                    </p>
                                </Card>
                            }
                        >
                            {children}
                        </RoleGate>
                    </div>
                </main>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/auth";

interface RoleGateProps {
    roles: UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RoleGate({ roles, children, fallback = null }: RoleGateProps) {
    const { userRole } = useAuth();

    if (!userRole || !roles.includes(userRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

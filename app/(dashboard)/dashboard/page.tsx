"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/shared/Card";
import { RoleGate } from "@/components/shared/RoleGate";
import { StatCard } from "@/components/dashboard/StatCard";
import { MetricChart } from "@/components/dashboard/MetricChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatCurrency } from "@/lib/formatters";

export default function DashboardPage() {
    const { user, userRole } = useAuth();
    const {
        activeMembers,
        todayCheckIns,
        openMaintenance,
        monthlyRevenue,
        attendanceByDay,
        activityItems,
    } = useDashboardStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="display-lg text-on-surface">Dashboard</h1>
                <p className="text-body-md text-on-surface-variant mt-1">
                    Welcome back, {user?.firstName}!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Active Members" value={String(activeMembers)} trend="Live from member records" tone="success" />
                <StatCard label="Today's Check-ins" value={String(todayCheckIns)} trend="Live attendance feed" />
                <StatCard label="Open Maintenance" value={String(openMaintenance)} trend="Under maintenance + damaged" tone="warning" />
                <StatCard label="Monthly Revenue" value={formatCurrency(monthlyRevenue)} trend="Sum of paid transactions" tone="success" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <MetricChart title="Attendance Trend" values={attendanceByDay} />
                </div>
                <ActivityFeed items={activityItems} />
            </div>

            <RoleGate
                roles={["ADMIN", "STAFF"]}
                fallback={
                    <Card variant="outlined">
                        <p className="text-body-md text-on-surface-variant">
                            You are logged in as <span className="font-semibold text-on-surface">{userRole}</span>.
                        </p>
                    </Card>
                }
            >
                <Card variant="outlined">
                    <h2 className="title-md text-on-surface mb-2">Operations Snapshot</h2>
                    <p className="text-body-md text-on-surface-variant">
                        7 memberships expiring this week, 2 unresolved support requests, and 1 pending payroll review.
                    </p>
                </Card>
            </RoleGate>

            <RoleGate roles={["TRAINER"]}>
                <Card variant="outlined">
                    <h2 className="title-md text-on-surface mb-2">Trainer Focus</h2>
                    <p className="text-body-md text-on-surface-variant">
                        You have 5 sessions scheduled today and 3 members with missed check-ins this week.
                    </p>
                </Card>
            </RoleGate>

            <RoleGate roles={["MEMBER"]}>
                <Card variant="outlined">
                    <h2 className="title-md text-on-surface mb-2">Member Focus</h2>
                    <p className="text-body-md text-on-surface-variant">
                        Your next training session starts at 7:30 AM tomorrow. Keep your 4-day streak alive.
                    </p>
                </Card>
            </RoleGate>
        </div>
    );
}

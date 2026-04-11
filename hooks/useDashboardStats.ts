"use client";

import { useMemo } from "react";
import { useMembers } from "@/hooks/useMembers";
import { useAttendance } from "@/hooks/useAttendance";
import { useEquipment } from "@/hooks/useEquipment";
import { usePayments } from "@/hooks/usePayments";
import { ActivityItem } from "@/components/dashboard/ActivityFeed";

export function useDashboardStats() {
    const membersQuery = useMembers({ page: 1, limit: 10 });
    const attendanceQuery = useAttendance({ page: 1, limit: 200 });
    const equipmentQuery = useEquipment({ page: 1, limit: 200 });
    const paymentsQuery = usePayments({ page: 1, limit: 200, status: "PAID" });

    const stats = useMemo(() => {
        const activeMembers = membersQuery.data?.meta.total ?? 0;

        const today = new Date().toDateString();
        const attendanceEvents = attendanceQuery.data?.data ?? [];

        const todayCheckIns = attendanceEvents.filter((event) => {
            return event.type === "CHECK_IN" && new Date(event.timestamp).toDateString() === today;
        }).length;

        const openMaintenance = (equipmentQuery.data?.data ?? []).filter(
            (item) => item.status === "UNDER_MAINTENANCE" || item.status === "DAMAGED"
        ).length;

        const monthlyRevenue = (paymentsQuery.data?.data ?? []).reduce((sum, payment) => {
            const paidAt = new Date(payment.paidAt);
            const now = new Date();
            const inCurrentMonth =
                paidAt.getMonth() === now.getMonth() && paidAt.getFullYear() === now.getFullYear();
            return inCurrentMonth ? sum + payment.amount : sum;
        }, 0);

        const attendanceByDay = Array.from({ length: 7 }, (_, idx) => {
            const day = new Date();
            day.setDate(day.getDate() - (6 - idx));
            const dayString = day.toDateString();
            return attendanceEvents.filter((event) => {
                return event.type === "CHECK_IN" && new Date(event.timestamp).toDateString() === dayString;
            }).length;
        });

        const recentMembers = (membersQuery.data?.data ?? [])
            .slice(0, 2)
            .map((member, idx): ActivityItem => ({
                id: `member-${member.id}`,
                title: "New Member Registered",
                subtitle: `${member.firstName} ${member.lastName} joined the gym`,
                time: idx === 0 ? "recent" : "earlier",
            }));

        const recentPayments = (paymentsQuery.data?.data ?? [])
            .slice(0, 2)
            .map((payment, idx): ActivityItem => ({
                id: `payment-${payment.id}`,
                title: "Payment Received",
                subtitle: `${payment.member?.firstName ?? "Member"} paid ${payment.amount} ${payment.currency}`,
                time: idx === 0 ? "recent" : "earlier",
            }));

        const recentAttendance = attendanceEvents
            .slice(0, 2)
            .map((event, idx): ActivityItem => ({
                id: `attendance-${event.id}`,
                title: event.type === "CHECK_IN" ? "Member Checked In" : "Member Checked Out",
                subtitle: `${event.member?.firstName ?? "Member"} ${event.member?.lastName ?? ""}`.trim(),
                time: idx === 0 ? "recent" : "earlier",
            }));

        const activityItems = [...recentMembers, ...recentPayments, ...recentAttendance].slice(0, 5);

        return {
            activeMembers,
            todayCheckIns,
            openMaintenance,
            monthlyRevenue,
            attendanceByDay,
            activityItems,
        };
    }, [membersQuery.data, attendanceQuery.data, equipmentQuery.data, paymentsQuery.data]);

    return {
        ...stats,
        isLoading:
            membersQuery.isLoading ||
            attendanceQuery.isLoading ||
            equipmentQuery.isLoading ||
            paymentsQuery.isLoading,
        isError:
            membersQuery.isError ||
            attendanceQuery.isError ||
            equipmentQuery.isError ||
            paymentsQuery.isError,
    };
}

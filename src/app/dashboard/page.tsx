"use client";

import { useEffect, useState } from "react";
import { OverviewHeader } from "@/components/dashboard/OverviewHeader";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CapacityWidget } from "@/components/dashboard/CapacityWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { apiClient, PaginationResponse } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";

// Minimal types for the dashboard data fetches
interface InventoryMovement {
    id: string;
    movementType: "INCOMING" | "OUTGOING" | "ADJUSTMENT";
    quantity: number;
    reason: string;
    note?: string;
    occurredAt: string;
    createdAt: string;
}

interface Product {
    id: string;
    quantity: number;
    [key: string]: unknown;
}

interface DashboardMetrics {
    totalMembers: number;
    totalTrainers: number;
    totalEquipment: number;
    activeSubscriptionCount: number;
    hasLowStock: boolean;
    recentMovements: InventoryMovement[];
}

export default function DashboardPage() {
    const { showToast } = useToast();

    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalMembers: 0,
        totalTrainers: 0,
        totalEquipment: 0,
        activeSubscriptionCount: 0,
        hasLowStock: false,
        recentMovements: [],
    });

    // Track loading state per section so partial failures still render other cards
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [loadingTrainers, setLoadingTrainers] = useState(true);
    const [loadingEquipment, setLoadingEquipment] = useState(true);
    const [loadingActivity, setLoadingActivity] = useState(true);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            // Use Promise.allSettled so a single failing fetch doesn't block the rest
            const [
                membersResult,
                trainersResult,
                equipmentResult,
                movementsResult,
                subscriptionsResult,
                productsResult,
            ] = await Promise.allSettled([
                apiClient<PaginationResponse<unknown>>("/members", {
                    params: { page: 1, limit: 1 },
                }),
                apiClient<PaginationResponse<unknown>>("/trainers", {
                    params: { page: 1, limit: 1, includeDeleted: false },
                }),
                apiClient<PaginationResponse<unknown>>("/equipment", {
                    params: { page: 1, limit: 1, includeDeleted: false },
                }),
                apiClient<PaginationResponse<InventoryMovement>>(
                    "/inventory-movements",
                    { params: { page: 1, limit: 5 } },
                ),
                apiClient<PaginationResponse<unknown>>("/member-subscriptions", {
                    params: { status: "ACTIVE", limit: 1 },
                }),
                apiClient<PaginationResponse<Product>>("/products", {
                    params: { limit: 50 },
                }),
            ]);

            // Members
            if (membersResult.status === "fulfilled") {
                setMetrics((prev) => ({
                    ...prev,
                    totalMembers: membersResult.value.meta.totalItems,
                }));
            } else {
                showToast("Failed to load member count.", "error");
            }
            setLoadingMembers(false);

            // Trainers
            if (trainersResult.status === "fulfilled") {
                setMetrics((prev) => ({
                    ...prev,
                    totalTrainers: trainersResult.value.meta.totalItems,
                }));
            } else {
                showToast("Failed to load trainer count.", "error");
            }
            setLoadingTrainers(false);

            // Equipment
            if (equipmentResult.status === "fulfilled") {
                setMetrics((prev) => ({
                    ...prev,
                    totalEquipment: equipmentResult.value.meta.totalItems,
                }));
            } else {
                showToast("Failed to load equipment count.", "error");
            }
            setLoadingEquipment(false);

            // Recent inventory movements
            if (movementsResult.status === "fulfilled") {
                setMetrics((prev) => ({
                    ...prev,
                    recentMovements: movementsResult.value.data.slice(0, 5),
                }));
            } else {
                showToast("Failed to load recent activity.", "error");
            }
            setLoadingActivity(false);

            // Active subscriptions count (Requirement 3.3)
            if (subscriptionsResult.status === "fulfilled") {
                setMetrics((prev) => ({
                    ...prev,
                    activeSubscriptionCount: subscriptionsResult.value.meta.totalItems,
                }));
            } else {
                showToast("Failed to load subscription count.", "error");
            }
            setLoadingSubscriptions(false);

            // Low-stock check: any product with quantity <= 5 (Requirement 3.4)
            if (productsResult.status === "fulfilled") {
                const hasLowStock = productsResult.value.data.some(
                    (p) => p.quantity <= 5,
                );
                setMetrics((prev) => ({ ...prev, hasLowStock }));
            } else {
                showToast("Failed to load product stock data.", "error");
            }
            setLoadingProducts(false);
        }

        loadDashboardData();
    }, [showToast]);

    return (
        <div className="animate-in fade-in duration-500 max-w-[1600px] mx-auto">
            <OverviewHeader />

            <div className="flex flex-col gap-6">
                {/* Top Data Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        {loadingMembers ? (
                            <SkeletonCard lines={3} className="h-full" />
                        ) : (
                            <StatsOverview totalMembers={metrics.totalMembers} />
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        {loadingTrainers ||
                            loadingEquipment ||
                            loadingSubscriptions ||
                            loadingProducts ? (
                            <div className="grid grid-cols-2 gap-4 h-full">
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                        ) : (
                            <MetricsGrid
                                totalTrainers={metrics.totalTrainers}
                                totalEquipment={metrics.totalEquipment}
                                activeSubscriptionCount={metrics.activeSubscriptionCount}
                                hasLowStock={metrics.hasLowStock}
                            />
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        <AttendanceChart />
                    </div>
                </div>

                {/* Bottom Data Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-1 flex flex-col h-full">
                        <CapacityWidget />
                        <QuickActionsWidget />
                    </div>
                    <div className="xl:col-span-2">
                        {loadingActivity ? (
                            <SkeletonCard lines={5} className="h-full" />
                        ) : (
                            <RecentActivityTable activities={metrics.recentMovements} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

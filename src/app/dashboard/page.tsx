"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OverviewHeader } from "@/components/dashboard/OverviewHeader";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CapacityWidget } from "@/components/dashboard/CapacityWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import {
    apiClient,
    normalizeListResponse,
    PaginationResponse,
} from "@/lib/apiClient";
import { hasAuthority } from "@/lib/authorization";
import { useToast } from "@/contexts/ToastContext";
import {
    type DashboardSection,
    useDashboardSection,
} from "@/contexts/DashboardSectionContext";
import { useAuth } from "@/contexts/AuthContext";
import type { PermissionFeature } from "@/contexts/AuthContext";

const SECTION_COPY: Record<Exclude<DashboardSection, "overview">, {
    title: string;
    description: string;
}> = {
    activity: {
        title: "Activity",
        description:
            "Recent gym operations and timeline insights will appear here.",
    },
    manage: {
        title: "Manage",
        description:
            "Quick admin controls and management tools are grouped in this section.",
    },
    programs: {
        title: "Programs",
        description:
            "Program and class management snapshots will be shown in this view.",
    },
    account: {
        title: "Account",
        description:
            "Profile preferences, branch settings, and personal options belong here.",
    },
    reports: {
        title: "Reports",
        description:
            "Business and performance reports will be surfaced in this section.",
    },
};

interface ProtectedLink {
    label: string;
    href: string;
    feature: PermissionFeature;
}

const REPORT_LINKS: ProtectedLink[] = [
    { label: "Members", href: "/dashboard/members", feature: "MEMBERS" },
    {
        label: "Subscriptions",
        href: "/dashboard/subscriptions",
        feature: "MEMBER_SUBSCRIPTIONS",
    },
    {
        label: "Inventory",
        href: "/dashboard/inventory",
        feature: "INVENTORY_MOVEMENTS",
    },
    { label: "Sales", href: "/dashboard/sales", feature: "PRODUCT_SALES" },
];

const MANAGE_LINKS: ProtectedLink[] = [
    { label: "Users", href: "/dashboard/users", feature: "USERS" },
    { label: "Branches", href: "/dashboard/branches", feature: "BRANCHES" },
    {
        label: "Permissions",
        href: "/dashboard/permissions",
        feature: "ROLE_PERMISSIONS",
    },
    { label: "Trainers", href: "/dashboard/trainers", feature: "TRAINERS" },
    { label: "Members", href: "/dashboard/members", feature: "MEMBERS" },
    { label: "Equipment", href: "/dashboard/equipment", feature: "EQUIPMENT" },
];

const PROGRAM_LINKS: ProtectedLink[] = [
    {
        label: "Membership Plans",
        href: "/dashboard/plans",
        feature: "MEMBERSHIP_PLANS",
    },
    {
        label: "Subscriptions",
        href: "/dashboard/subscriptions",
        feature: "MEMBER_SUBSCRIPTIONS",
    },
    { label: "Products", href: "/dashboard/products", feature: "PRODUCTS" },
    { label: "Sales", href: "/dashboard/sales", feature: "PRODUCT_SALES" },
];

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
    const { section } = useDashboardSection();
    const { user, logout, activeBranchId, permissions } = useAuth();

    const canView = (feature: PermissionFeature): boolean => {
        return hasAuthority(user, permissions, feature, "VIEW");
    };

    const visibleManageLinks = MANAGE_LINKS.filter((item) => canView(item.feature));
    const visibleProgramLinks = PROGRAM_LINKS.filter((item) => canView(item.feature));
    const visibleReportLinks = REPORT_LINKS.filter((item) => canView(item.feature));

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
                const normalizedMembers = normalizeListResponse(membersResult.value);
                setMetrics((prev) => ({
                    ...prev,
                    totalMembers: normalizedMembers.meta.totalItems,
                }));
            } else {
                showToast("Failed to load member count.", "error");
            }
            setLoadingMembers(false);

            // Trainers
            if (trainersResult.status === "fulfilled") {
                const normalizedTrainers = normalizeListResponse(trainersResult.value);
                setMetrics((prev) => ({
                    ...prev,
                    totalTrainers: normalizedTrainers.meta.totalItems,
                }));
            } else {
                showToast("Failed to load trainer count.", "error");
            }
            setLoadingTrainers(false);

            // Equipment
            if (equipmentResult.status === "fulfilled") {
                const normalizedEquipment = normalizeListResponse(equipmentResult.value);
                setMetrics((prev) => ({
                    ...prev,
                    totalEquipment: normalizedEquipment.meta.totalItems,
                }));
            } else {
                showToast("Failed to load equipment count.", "error");
            }
            setLoadingEquipment(false);

            // Recent inventory movements
            if (movementsResult.status === "fulfilled") {
                const normalizedMovements = normalizeListResponse(movementsResult.value);
                setMetrics((prev) => ({
                    ...prev,
                    recentMovements: normalizedMovements.data.slice(0, 5),
                }));
            } else {
                showToast("Failed to load recent activity.", "error");
            }
            setLoadingActivity(false);

            // Active subscriptions count (Requirement 3.3)
            if (subscriptionsResult.status === "fulfilled") {
                const normalizedSubscriptions = normalizeListResponse(
                    subscriptionsResult.value,
                );
                setMetrics((prev) => ({
                    ...prev,
                    activeSubscriptionCount: normalizedSubscriptions.meta.totalItems,
                }));
            } else {
                showToast("Failed to load subscription count.", "error");
            }
            setLoadingSubscriptions(false);

            // Low-stock check: any product with quantity <= 5 (Requirement 3.4)
            if (productsResult.status === "fulfilled") {
                const normalizedProducts = normalizeListResponse(productsResult.value);
                const hasLowStock = normalizedProducts.data.some((p) => p.quantity <= 5);
                setMetrics((prev) => ({ ...prev, hasLowStock }));
            } else {
                showToast("Failed to load product stock data.", "error");
            }
            setLoadingProducts(false);
        }

        loadDashboardData();
    }, [showToast]);

    if (section !== "overview") {
        const sectionContent = SECTION_COPY[section];

        if (section === "activity") {
            const canViewInventoryActivity = canView("INVENTORY_MOVEMENTS");
            return (
                <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
                    <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                            {sectionContent.title}
                        </h1>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mb-6">
                            {sectionContent.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {canViewInventoryActivity && (
                                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                        Recent Movements
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metrics.recentMovements.length}
                                    </p>
                                </div>
                            )}
                            <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                    Active Subscriptions
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {metrics.activeSubscriptionCount}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                    Stock Alerts
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {metrics.hasLowStock ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                        {!canViewInventoryActivity ? (
                            <p className="text-sm text-gray-500">
                                You do not have access to inventory activity details.
                            </p>
                        ) : loadingActivity ? (
                            <SkeletonCard lines={5} className="h-full" />
                        ) : (
                            <RecentActivityTable activities={metrics.recentMovements} />
                        )}
                    </section>
                </div>
            );
        }

        if (section === "manage") {
            return (
                <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
                    <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                            {sectionContent.title}
                        </h1>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mb-6">
                            {sectionContent.description}
                        </p>
                        {visibleManageLinks.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                You do not have permission to view management modules.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {visibleManageLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="rounded-2xl border border-gray-200 p-5 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                    >
                                        <p className="text-base font-semibold text-gray-900">
                                            {item.label}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Open {item.label.toLowerCase()} management
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            );
        }

        if (section === "programs") {
            const canViewMembers = canView("MEMBERS");
            const canViewSubscriptions = canView("MEMBER_SUBSCRIPTIONS");
            const canViewProducts = canView("PRODUCTS");
            return (
                <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
                    <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                            {sectionContent.title}
                        </h1>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mb-6">
                            {sectionContent.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {canViewMembers && (
                                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                        Total Members
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metrics.totalMembers}
                                    </p>
                                </div>
                            )}
                            {canViewSubscriptions && (
                                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                        Active Subscriptions
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metrics.activeSubscriptionCount}
                                    </p>
                                </div>
                            )}
                            {canViewProducts && (
                                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                        Product Stock
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metrics.hasLowStock ? "Low" : "Healthy"}
                                    </p>
                                </div>
                            )}
                        </div>
                        {visibleProgramLinks.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                You do not have permission to view program modules.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {visibleProgramLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="rounded-2xl border border-gray-200 p-5 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                    >
                                        <p className="text-base font-semibold text-gray-900">
                                            {item.label}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            View and manage {item.label.toLowerCase()}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            );
        }

        if (section === "account") {
            return (
                <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
                    <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                            {sectionContent.title}
                        </h1>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mb-6">
                            {sectionContent.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                    Email
                                </p>
                                <p className="text-lg font-semibold text-gray-900 break-all">
                                    {user?.email ?? "Not available"}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                    Role
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user?.globalRole ?? "Not available"}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50 md:col-span-2">
                                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                    Active Branch
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {activeBranchId ?? user?.branchId ?? "No branch selected"}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={logout}
                                className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </section>
                </div>
            );
        }

        if (section === "reports") {
            const canViewMembers = canView("MEMBERS");
            const canViewTrainers = canView("TRAINERS");
            const canViewEquipment = canView("EQUIPMENT");
            const canViewSubscriptions = canView("MEMBER_SUBSCRIPTIONS");
            return (
                <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
                    <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                            {sectionContent.title}
                        </h1>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mb-6">
                            {sectionContent.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                            {canViewMembers && (
                                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                        Members
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metrics.totalMembers}
                                    </p>
                                </div>
                            )}
                            {canViewTrainers && (
                                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                        Trainers
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metrics.totalTrainers}
                                    </p>
                                </div>
                            )}
                            {canViewEquipment && (
                                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                        Equipment
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metrics.totalEquipment}
                                    </p>
                                </div>
                            )}
                            {canViewSubscriptions && (
                                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                        Active Subscriptions
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {metrics.activeSubscriptionCount}
                                    </p>
                                </div>
                            )}
                        </div>
                        {visibleReportLinks.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                You do not have permission to view report modules.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {visibleReportLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="rounded-2xl border border-gray-200 p-5 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                    >
                                        <p className="text-base font-semibold text-gray-900">
                                            {item.label} Report
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Go to {item.label.toLowerCase()} details
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            );
        }

        return (
            <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8">
                <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                        {sectionContent.title}
                    </h1>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl">
                        {sectionContent.description}
                    </p>
                </section>
            </div>
        );
    }

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

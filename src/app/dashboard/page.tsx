"use client";

import { OverviewHeader } from "@/components/dashboard/OverviewHeader";
import { hasAuthority } from "@/lib/authorization";
import { useDashboardSection } from "@/contexts/DashboardSectionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { OverviewContent } from "@/components/dashboard/sections/OverviewContent";
import { ActivitySection } from "@/components/dashboard/sections/ActivitySection";
import { ReportsSection } from "@/components/dashboard/sections/ReportsSection";
import { LinkGridSection } from "@/components/dashboard/sections/LinkGridSection";
import { AccountSection } from "@/components/dashboard/sections/AccountSection";

const SECTION_COPY = {
    activity: {
        title: "Activity",
        description: "Recent gym operations and timeline insights will appear here.",
    },
    manage: {
        title: "Manage",
        description: "Quick admin controls and management tools are grouped in this section.",
    },
    programs: {
        title: "Programs",
        description: "Program and class management snapshots will be shown in this view.",
    },
    account: {
        title: "Account",
        description: "Profile preferences, branch settings, and personal options belong here.",
    },
    reports: {
        title: "Reports",
        description: "Business and performance reports will be surfaced in this section.",
    },
};

const REPORT_LINKS = [
    { label: "Members", href: "/dashboard/members", feature: "MEMBERS" },
    { label: "Subscriptions", href: "/dashboard/subscriptions", feature: "MEMBER_SUBSCRIPTIONS" },
    { label: "Inventory", href: "/dashboard/inventory", feature: "INVENTORY_MOVEMENTS" },
    { label: "Sales", href: "/dashboard/sales", feature: "PRODUCT_SALES" },
];

const MANAGE_LINKS = [
    { label: "Users", href: "/dashboard/users", feature: "USERS" },
    { label: "Branches", href: "/dashboard/branches", feature: "BRANCHES" },
    { label: "Permissions", href: "/dashboard/permissions", feature: "ROLE_PERMISSIONS" },
    { label: "Trainers", href: "/dashboard/trainers", feature: "TRAINERS" },
    { label: "Members", href: "/dashboard/members", feature: "MEMBERS" },
    { label: "Equipment", href: "/dashboard/equipment", feature: "EQUIPMENT" },
];

const PROGRAM_LINKS = [
    { label: "Membership Plans", href: "/dashboard/plans", feature: "MEMBERSHIP_PLANS" },
    { label: "Subscriptions", href: "/dashboard/subscriptions", feature: "MEMBER_SUBSCRIPTIONS" },
    { label: "Products", href: "/dashboard/products", feature: "PRODUCTS" },
    { label: "Sales", href: "/dashboard/sales", feature: "PRODUCT_SALES" },
];

export default function DashboardPage() {
    const { section } = useDashboardSection();
    const { user, logout, activeBranchId, permissions } = useAuth();
    const { metrics, loadingStates } = useDashboardMetrics();

    const canView = (feature: any): boolean => {
        return hasAuthority(user, permissions, feature, "VIEW");
    };

    const filterVisibleLinks = (links: any[]) => 
        links.filter((item) => canView(item.feature)).map(({ label, href }) => ({ label, href }));

    // Overview Render
    if (section === "overview") {
        return (
            <div className="animate-in fade-in duration-500 max-w-[1600px] mx-auto">
                <OverviewHeader />
                <OverviewContent metrics={metrics} loadingStates={loadingStates} />
            </div>
        );
    }

    const sectionContent = SECTION_COPY[section as keyof typeof SECTION_COPY];

    // Activity Render
    if (section === "activity") {
        return (
            <ActivitySection
                metrics={metrics}
                loadingActivity={loadingStates.activity}
                canViewInventoryActivity={canView("INVENTORY_MOVEMENTS")}
                title={sectionContent.title}
                description={sectionContent.description}
            />
        );
    }

    // Manage Render
    if (section === "manage") {
        return (
            <LinkGridSection
                title={sectionContent.title}
                description={sectionContent.description}
                links={filterVisibleLinks(MANAGE_LINKS)}
                emptyMessage="You do not have permission to view management modules."
            />
        );
    }

    // Programs Render
    if (section === "programs") {
        // Programs uses a hybrid layout (stats + links)
        // For simplicity, we can use the same ReportsSection structure if suitable or LinkGrid
        return (
            <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
                <ReportsSection
                    metrics={metrics}
                    visibleLinks={filterVisibleLinks(PROGRAM_LINKS)}
                    canView={canView}
                    title={sectionContent.title}
                    description={sectionContent.description}
                />
            </div>
        );
    }

    // Account Render
    if (section === "account") {
        return (
            <AccountSection
                user={user}
                activeBranchId={activeBranchId}
                logout={logout}
                title={sectionContent.title}
                description={sectionContent.description}
            />
        );
    }

    // Reports Render
    if (section === "reports") {
        return (
            <ReportsSection
                metrics={metrics}
                visibleLinks={filterVisibleLinks(REPORT_LINKS)}
                canView={canView}
                title={sectionContent.title}
                description={sectionContent.description}
            />
        );
    }

    // Default Fallback
    return (
        <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8">
            <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {sectionContent?.title}
                </h1>
                <p className="text-gray-600 text-base lg:text-lg max-w-2xl">
                    {sectionContent?.description}
                </p>
            </section>
        </div>
    );
}

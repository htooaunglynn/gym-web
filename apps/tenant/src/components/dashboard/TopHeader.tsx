"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Search, Bell, Info, ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { BranchSwitcher } from "@/components/dashboard/BranchSwitcher";
import { hasAuthority } from "@/lib/authorization";
import {
    DASHBOARD_SECTIONS,
    type DashboardSection,
    useDashboardSection,
} from "@/contexts/DashboardSectionContext";
import type { PermissionFeature } from "@/contexts/AuthContext";

const SECTION_LABELS: Record<DashboardSection, string> = {
    overview: "Overview",
    activity: "Activity",
    manage: "Manage",
    programs: "Programs",
    account: "Account",
    reports: "Reports",
};

export function TopHeader() {
    const { user, logout, permissions } = useAuth();
    const { section, setSection } = useDashboardSection();
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement | null>(null);
    const mounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false,
    );
    const shouldShowBranchSwitcher = !pathname.startsWith("/dashboard/branches");

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Derive display values from live auth state — use placeholders until mounted
    const displayName = mounted && user ? `${user.email.split("@")[0]}` : "—";
    const displayEmail = mounted ? (user?.email ?? "—") : "—";
    const displayRole = mounted ? (user?.globalRole ?? "") : "";

    const canView = (feature: PermissionFeature): boolean => {
        return hasAuthority(user, permissions, feature, "VIEW");
    };

    const manageFeatures: PermissionFeature[] = [
        "USERS",
        "BRANCHES",
        "ROLE_PERMISSIONS",
        "TRAINERS",
        "MEMBERS",
        "EQUIPMENT",
    ];
    const hasManageAccess = manageFeatures.some((feature) => canView(feature));

    const programFeatures: PermissionFeature[] = [
        "MEMBERSHIP_PLANS",
        "MEMBER_SUBSCRIPTIONS",
        "PRODUCTS",
        "PRODUCT_SALES",
    ];
    const hasProgramsAccess = programFeatures.some((feature) => canView(feature));

    const activityFeatures: PermissionFeature[] = [
        "INVENTORY_MOVEMENTS",
        "MEMBER_SUBSCRIPTIONS",
        "PRODUCTS",
    ];
    const hasActivityAccess = activityFeatures.some((feature) => canView(feature));

    const reportFeatures: PermissionFeature[] = [
        "MEMBERS",
        "TRAINERS",
        "EQUIPMENT",
        "MEMBER_SUBSCRIPTIONS",
        "INVENTORY_MOVEMENTS",
        "PRODUCT_SALES",
    ];
    const hasReportsAccess = reportFeatures.some((feature) => canView(feature));

    const visibleTabs: DashboardSection[] = DASHBOARD_SECTIONS.filter((tab) => {
        if (tab === "overview" || tab === "account") return true;
        if (tab === "activity") return hasActivityAccess;
        if (tab === "manage") return hasManageAccess;
        if (tab === "programs") return hasProgramsAccess;
        if (tab === "reports") return hasReportsAccess;
        return false;
    });

    useEffect(() => {
        if (!visibleTabs.includes(section)) {
            setSection("overview");
        }
    }, [section, setSection, visibleTabs]);

    const handleSectionSelect = (nextSection: DashboardSection) => {
        setSection(nextSection);
        if (pathname !== "/dashboard") {
            router.push("/dashboard");
        }
    };

    return (
        <header className="w-full h-24 flex items-center justify-between px-8 bg-[#F8F9FA] border-b border-[#e5e5e0]">
            {/* Pills Navigation */}
            <div className="flex items-center bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
                {visibleTabs.map((tab) => {
                    const isActive = section === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => handleSectionSelect(tab)}
                            className={`px-6 py-2.5 text-sm rounded-full transition-colors ${
                                isActive
                                    ? "bg-gray-900 text-white font-semibold shadow-md"
                                    : "text-gray-500 hover:text-gray-900 font-medium"
                            }`}
                        >
                            {SECTION_LABELS[tab]}
                        </button>
                    );
                })}
            </div>

            {/* Right Side Tools & Profile */}
            <div className="flex items-center gap-4">
                {/* Branch Switcher — only rendered for ADMIN users (BranchSwitcher returns null otherwise) */}
                {shouldShowBranchSwitcher ? <BranchSwitcher /> : null}

                {/* Actions Group */}
                <div className="flex items-center gap-2 bg-white rounded-full p-2 px-3 shadow-sm border border-gray-100">
                    <button
                        aria-label="Search"
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <Search className="w-5 h-5 pointer-events-none" />
                    </button>
                    <button
                        aria-label="Notifications"
                        className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2 w-2 h-2 bg-[#FF5C39] border border-white rounded-full" />
                    </button>
                    <button
                        aria-label="Information"
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <Info className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Dropdown — wired to live auth state */}
                <div className="relative" ref={profileMenuRef}>
                    <button
                        type="button"
                        aria-label="Open profile menu"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="flex items-center gap-3 bg-white rounded-full p-2 pr-4 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors text-left"
                    >
                        <div className="w-10 h-10 relative overflow-hidden rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
                            {mounted && user ? (
                                <span className="text-sm font-bold text-gray-600 uppercase select-none">
                                    {user.email.charAt(0)}
                                </span>
                            ) : mounted ? (
                                <Image
                                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop"
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : null}
                        </div>
                        <div className="hidden xl:flex flex-col">
                            <span className="text-sm font-bold text-gray-900 leading-tight">
                                {displayName}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                                {displayEmail}
                            </span>
                            {displayRole && (
                                <span className="text-xs text-[#62625b] font-medium">
                                    {displayRole}
                                </span>
                            )}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 min-w-52 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-30">
                            <button
                                type="button"
                                onClick={logout}
                                className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

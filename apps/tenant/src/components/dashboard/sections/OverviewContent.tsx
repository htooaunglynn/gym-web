import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { CapacityWidget } from "@/components/dashboard/CapacityWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { DashboardMetrics } from "@/hooks/useDashboardMetrics";

interface OverviewContentProps {
    metrics: DashboardMetrics;
    loadingStates: Record<string, boolean>;
}

export function OverviewContent({ metrics, loadingStates }: OverviewContentProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    {loadingStates.members ? (
                        <SkeletonCard lines={3} className="h-full" />
                    ) : (
                        <StatsOverview totalMembers={metrics.totalMembers} />
                    )}
                </div>
                <div className="lg:col-span-1">
                    {loadingStates.trainers ||
                        loadingStates.equipment ||
                        loadingStates.subscriptions ||
                        loadingStates.products ? (
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1 flex flex-col h-full">
                    <CapacityWidget />
                    <QuickActionsWidget />
                </div>
                <div className="xl:col-span-2">
                    {loadingStates.activity ? (
                        <SkeletonCard lines={5} className="h-full" />
                    ) : (
                        <RecentActivityTable activities={metrics.recentMovements} />
                    )}
                </div>
            </div>
        </div>
    );
}

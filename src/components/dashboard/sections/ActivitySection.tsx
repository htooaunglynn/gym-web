import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { DashboardMetrics } from "@/hooks/useDashboardMetrics";

interface ActivitySectionProps {
    metrics: DashboardMetrics;
    loadingActivity: boolean;
    canViewInventoryActivity: boolean;
    title: string;
    description: string;
}

export function ActivitySection({
    metrics,
    loadingActivity,
    canViewInventoryActivity,
    title,
    description,
}: ActivitySectionProps) {
    return (
        <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
            <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {title}
                </h1>
                <p className="text-gray-600 text-base lg:text-lg max-w-2xl mb-6">
                    {description}
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

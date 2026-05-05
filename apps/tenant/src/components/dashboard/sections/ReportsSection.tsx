import Link from "next/link";
import { DashboardMetrics } from "@/hooks/useDashboardMetrics";

interface ReportLink {
    label: string;
    href: string;
}

interface ReportsSectionProps {
    metrics: DashboardMetrics;
    visibleLinks: ReportLink[];
    canView: (feature: any) => boolean;
    title: string;
    description: string;
}

export function ReportsSection({
    metrics,
    visibleLinks,
    canView,
    title,
    description,
}: ReportsSectionProps) {
    return (
        <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
            <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {title}
                </h1>
                <p className="text-gray-600 text-base lg:text-lg max-w-2xl mb-6">
                    {description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    {canView("MEMBERS") && (
                        <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                Members
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {metrics.totalMembers}
                            </p>
                        </div>
                    )}
                    {canView("TRAINERS") && (
                        <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                Trainers
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {metrics.totalTrainers}
                            </p>
                        </div>
                    )}
                    {canView("EQUIPMENT") && (
                        <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                                Equipment
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {metrics.totalEquipment}
                            </p>
                        </div>
                    )}
                    {canView("MEMBER_SUBSCRIPTIONS") && (
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
                {visibleLinks.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        You do not have permission to view report modules.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {visibleLinks.map((item) => (
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

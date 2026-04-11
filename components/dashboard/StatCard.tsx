import React from "react";
import { Card } from "@/components/shared/Card";

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    tone?: "default" | "success" | "warning";
}

export function StatCard({ label, value, trend, tone = "default" }: StatCardProps) {
    const trendTone = {
        default: "text-on-surface-variant",
        success: "text-[var(--success)]",
        warning: "text-[var(--tertiary)]",
    };

    return (
        <Card variant="elevated" className="min-h-[132px]">
            <p className="text-label-md uppercase tracking-wide text-on-surface-variant">{label}</p>
            <p className="mt-2 text-3xl font-bold text-on-surface">{value}</p>
            {trend ? <p className={`mt-2 text-body-md ${trendTone[tone]}`}>{trend}</p> : null}
        </Card>
    );
}

import React from "react";
import { Card } from "@/components/shared/Card";

interface MetricChartProps {
    title: string;
    values: number[];
    max?: number;
}

export function MetricChart({ title, values, max }: MetricChartProps) {
    const highest = max ?? Math.max(...values, 1);

    return (
        <Card variant="outlined">
            <div className="flex items-center justify-between mb-4">
                <h2 className="title-md text-on-surface">{title}</h2>
                <span className="text-label-md text-on-surface-variant">Last 7 days</span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-40">
                {values.map((value, idx) => {
                    const height = Math.max(12, Math.round((value / highest) * 100));
                    return (
                        <div key={`${title}-${idx}`} className="flex flex-col items-center gap-2">
                            <div
                                className="w-full rounded-sm bg-primary/75"
                                style={{ height: `${height}%` }}
                                aria-label={`value ${value}`}
                            />
                            <span className="text-label-md text-on-surface-variant">D{idx + 1}</span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

import React from "react";
import { Card } from "@/components/shared/Card";

interface ModulePageTemplateProps {
    title: string;
    subtitle: string;
    highlights: string[];
    queue: { label: string; value: string }[];
}

export function ModulePageTemplate({
    title,
    subtitle,
    highlights,
    queue,
}: ModulePageTemplateProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="display-lg text-on-surface">{title}</h1>
                <p className="text-body-md text-on-surface-variant mt-1">{subtitle}</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Card variant="outlined" className="xl:col-span-2">
                    <h2 className="title-md text-on-surface mb-3">Current Focus</h2>
                    <ul className="space-y-3">
                        {highlights.map((item, idx) => (
                            <li key={`${title}-highlight-${idx}`} className="text-body-md text-on-surface-variant">
                                - {item}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card variant="elevated">
                    <h2 className="title-md text-on-surface mb-3">Quick Snapshot</h2>
                    <div className="space-y-3">
                        {queue.map((item) => (
                            <div key={item.label} className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                                <span className="text-body-md text-on-surface-variant">{item.label}</span>
                                <span className="text-body-md font-semibold text-on-surface">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

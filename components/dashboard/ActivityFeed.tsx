import React from "react";
import { Card } from "@/components/shared/Card";

export interface ActivityItem {
    id: string;
    title: string;
    subtitle: string;
    time: string;
}

interface ActivityFeedProps {
    title?: string;
    items: ActivityItem[];
}

export function ActivityFeed({ title = "Recent Activity", items }: ActivityFeedProps) {
    return (
        <Card variant="outlined">
            <h2 className="title-md text-on-surface mb-4">{title}</h2>

            <ul className="space-y-4">
                {items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-body-md font-semibold text-on-surface">{item.title}</p>
                            <p className="text-body-md text-on-surface-variant">{item.subtitle}</p>
                        </div>
                        <span className="text-label-md text-on-surface-variant whitespace-nowrap">{item.time}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

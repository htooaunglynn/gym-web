"use client";

import React from "react";
import { ModulePageTemplate } from "@/components/shared/ModulePageTemplate";

export default function PerformancePage() {
    return (
        <ModulePageTemplate
            title="Performance"
            subtitle="Review trainer and member performance indicators for coaching decisions."
            highlights={[
                "Trainer satisfaction score improved by 6% over the past four weeks.",
                "Member retention in strength programs outperformed cardio by 9%.",
                "Three cohorts crossed attendance consistency targets this week.",
            ]}
            queue={[
                { label: "Top Trainer Score", value: "94/100" },
                { label: "Retention Rate", value: "87%" },
                { label: "At-Risk Members", value: "9" },
            ]}
        />
    );
}

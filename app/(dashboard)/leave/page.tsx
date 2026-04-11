"use client";

import React from "react";
import { ModulePageTemplate } from "@/components/shared/ModulePageTemplate";

export default function LeavePage() {
    return (
        <ModulePageTemplate
            title="Leave Management"
            subtitle="Track leave requests, approvals, and staffing impact across shifts."
            highlights={[
                "Three leave requests need manager action within 24 hours.",
                "One trainer leave overlaps with a high-demand evening slot.",
                "Coverage is currently adequate for weekend operations.",
            ]}
            queue={[
                { label: "Pending Requests", value: "3" },
                { label: "Approved This Month", value: "11" },
                { label: "Coverage Alerts", value: "1" },
            ]}
        />
    );
}

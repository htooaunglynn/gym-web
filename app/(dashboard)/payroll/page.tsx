"use client";

import React from "react";
import { ModulePageTemplate } from "@/components/shared/ModulePageTemplate";

export default function PayrollPage() {
    return (
        <ModulePageTemplate
            title="Payroll"
            subtitle="Monitor payroll cycles, overtime adjustments, and payout readiness."
            highlights={[
                "Current cycle is 82% complete with no blocked calculations.",
                "Two overtime claims are awaiting final verification.",
                "One payout profile requires updated bank information.",
            ]}
            queue={[
                { label: "Cycle Completion", value: "82%" },
                { label: "Pending Overtime", value: "2" },
                { label: "Payout Exceptions", value: "1" },
            ]}
        />
    );
}

"use client";

import React from "react";
import { ModulePageTemplate } from "@/components/shared/ModulePageTemplate";

export default function RecruitmentPage() {
    return (
        <ModulePageTemplate
            title="Recruitment"
            subtitle="Track hiring pipeline health for trainers, staff, and operations roles."
            highlights={[
                "Seven candidates are in interview stage for trainer positions.",
                "Time-to-hire improved by 4 days compared to last month.",
                "Two applicants were advanced to offer review today.",
            ]}
            queue={[
                { label: "Open Roles", value: "5" },
                { label: "Interview Stage", value: "7" },
                { label: "Offers Drafting", value: "2" },
            ]}
        />
    );
}

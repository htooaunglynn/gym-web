"use client";

import React from "react";
import { ModulePageTemplate } from "@/components/shared/ModulePageTemplate";

export default function SchedulePage() {
    return (
        <ModulePageTemplate
            title="Schedule"
            subtitle="Plan classes, manage session windows, and avoid timetable conflicts."
            highlights={[
                "Morning bootcamp is at 92% capacity and likely to require overflow soon.",
                "Two trainer slots are still unassigned for Friday evening sessions.",
                "One class overlap warning is pending review for Studio B.",
            ]}
            queue={[
                { label: "Today Classes", value: "18" },
                { label: "Pending Reschedules", value: "4" },
                { label: "Unassigned Slots", value: "2" },
            ]}
        />
    );
}

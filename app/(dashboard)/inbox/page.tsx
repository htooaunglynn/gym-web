"use client";

import React from "react";
import { ModulePageTemplate } from "@/components/shared/ModulePageTemplate";

export default function InboxPage() {
    return (
        <ModulePageTemplate
            title="Inbox"
            subtitle="Review internal messages, escalation threads, and unresolved communications."
            highlights={[
                "Five unread messages are tagged as high priority.",
                "One member escalation has been open for more than 12 hours.",
                "Response SLA is currently within target for all support channels.",
            ]}
            queue={[
                { label: "Unread", value: "12" },
                { label: "High Priority", value: "5" },
                { label: "Overdue Threads", value: "1" },
            ]}
        />
    );
}

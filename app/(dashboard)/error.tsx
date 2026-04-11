"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/ErrorState";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard route error:", error);
    }, [error]);

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <ErrorState
                title="Dashboard error"
                message="This module failed to load. Please retry."
                onRetry={reset}
            />
        </div>
    );
}

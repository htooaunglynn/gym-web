"use client";

import { useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error boundary:", error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-surface flex items-center justify-center px-4">
                    <Card variant="elevated" className="max-w-md w-full text-center space-y-4">
                        <p className="text-label-md text-on-surface-variant">Unexpected Error</p>
                        <h1 className="headline-sm text-on-surface">Something went wrong</h1>
                        <p className="text-body-md text-on-surface-variant">
                            An unexpected error occurred. Please try again.
                        </p>
                        <div className="flex items-center justify-center">
                            <Button onClick={() => reset()} variant="primary">
                                Try again
                            </Button>
                        </div>
                    </Card>
                </div>
            </body>
        </html>
    );
}

import React from "react";
import { Button } from "./Button";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    message = "An error occurred while loading this content.",
    onRetry,
    className = "",
    ...props
}: ErrorStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 py-12 px-6 text-center ${className}`}
            {...props}
        >
            <svg
                className="w-16 h-16 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <div>
                <h3 className="headline-sm text-on-surface mb-2">{title}</h3>
                <p className="body-md text-on-surface-variant">{message}</p>
            </div>
            {onRetry && (
                <Button variant="secondary" size="md" onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </div>
    );
}

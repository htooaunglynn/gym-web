import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "error" | "warning" | "info";
    size?: "sm" | "md";
    children: React.ReactNode;
}

export function Badge({
    variant = "default",
    size = "sm",
    children,
    className = "",
    ...props
}: BadgeProps) {
    const variantClasses = {
        default: "bg-surface-container text-on-surface",
        success: "bg-secondary/20 text-secondary",
        error: "bg-error/20 text-error",
        warning: "bg-tertiary/20 text-tertiary",
        info: "bg-primary/20 text-primary",
    };

    const sizeClasses = {
        sm: "px-2 py-1 text-label-md",
        md: "px-3 py-1.5 text-body-md",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}

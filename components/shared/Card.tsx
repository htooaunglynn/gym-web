import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "default" | "elevated" | "outlined";
}

export function Card({
    children,
    variant = "default",
    className = "",
    ...props
}: CardProps) {
    const variantClasses = {
        default: "bg-surface-container-lowest border border-outline-variant/15",
        elevated: "bg-surface-container-lowest shadow-ambient",
        outlined: "bg-surface border border-outline-variant/30",
    };

    return (
        <div
            className={`rounded-md p-4 transition-default ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

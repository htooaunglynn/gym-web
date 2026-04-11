import React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    initials?: string;
    size?: "sm" | "md" | "lg";
}

export function Avatar({
    src,
    alt,
    initials,
    size = "md",
    className = "",
    ...props
}: AvatarProps) {
    const sizeClasses = {
        sm: "w-8 h-8 text-label-md",
        md: "w-10 h-10 text-body-md",
        lg: "w-12 h-12 text-title-md",
    };

    if (src) {
        return (
            <img
                src={src}
                alt={alt || "Avatar"}
                className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
                {...props}
            />
        );
    }

    return (
        <div
            className={`
        rounded-full
        bg-primary/20
        text-primary
        flex items-center justify-center
        font-semibold
        ${sizeClasses[size]}
        ${className}
      `}
            {...props}
        >
            {initials}
        </div>
    );
}

import React from "react";
import Image from "next/image";

interface AvatarProps {
    src?: string;
    alt?: string;
    initials?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Avatar({
    src,
    alt,
    initials,
    size = "md",
    className = "",
}: AvatarProps) {
    const sizeClasses = {
        sm: "w-8 h-8 text-label-md",
        md: "w-10 h-10 text-body-md",
        lg: "w-12 h-12 text-title-md",
    };

    const pixelSize = {
        sm: 32,
        md: 40,
        lg: 48,
    } as const;

    if (src) {
        return (
            <Image
                src={src}
                alt={alt || "Avatar"}
                width={pixelSize[size]}
                height={pixelSize[size]}
                className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
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
            aria-label={alt || "Avatar"}
        >
            {initials}
        </div>
    );
}

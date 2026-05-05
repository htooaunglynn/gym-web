"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#E84C4C] hover:bg-[#d43f3f] text-white shadow-lg shadow-[#E84C4C]/20",
  secondary:
    "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "text-gray-600 hover:bg-gray-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-xl",
  md: "px-5 py-2.5 text-sm rounded-2xl",
  lg: "px-7 py-3 text-base rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={[
        "inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .join(" ")
        .trim()}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
    </button>
  );
}

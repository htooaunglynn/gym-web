"use client";

import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

const sizes: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Spinner({
  size = "md",
  className = "",
  "aria-label": ariaLabel = "Loading",
}: SpinnerProps) {
  return (
    <svg
      className={["animate-spin text-current", sizes[size], className]
        .join(" ")
        .trim()}
      viewBox="0 0 24 24"
      fill="none"
      aria-label={ariaLabel}
      role="status"
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
  );
}

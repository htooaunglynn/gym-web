"use client";

import React from "react";

export interface SkeletonCardProps {
  /** Number of shimmer content lines to render below the title area. Defaults to 2. */
  lines?: number;
  /** Additional Tailwind classes to apply to the card container. */
  className?: string;
}

/**
 * Animated shimmer placeholder that matches the shape of a KPI card on the
 * Dashboard overview page (Requirements 3.2, 15.9, 17.9).
 *
 * Uses `bg-[#e5e5e0] animate-pulse` to match the warm design system's
 * skeleton colour and the card's rounded-3xl / shadow-sm style.
 */
export function SkeletonCard({ lines = 2, className = "" }: SkeletonCardProps) {
  return (
    <div
      aria-hidden="true"
      role="status"
      aria-label="Loading"
      className={`bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between ${className}`}
    >
      {/* Top row: label shimmer + icon shimmer */}
      <div className="flex justify-between items-start mb-6">
        <div className="h-3.5 w-28 bg-[#e5e5e0] animate-pulse rounded-full" />
        <div className="h-5 w-5 bg-[#e5e5e0] animate-pulse rounded-md" />
      </div>

      {/* Primary value shimmer */}
      <div className="h-9 w-20 bg-[#e5e5e0] animate-pulse rounded-full mb-3" />

      {/* Optional content lines */}
      <div className="flex flex-col gap-2 mt-auto">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-3 bg-[#e5e5e0] animate-pulse rounded-full ${
              i % 2 === 0 ? "w-3/4" : "w-1/2"
            }`}
          />
        ))}
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}

"use client";

import React from "react";

export interface SkeletonRowProps {
  /** Number of skeleton cells to render — should match the DataTable column count */
  columns: number;
  /** Whether to include an extra cell for the actions column. Defaults to false. */
  hasActions?: boolean;
}

/**
 * A single animated skeleton placeholder row for use inside a DataTable while
 * data is loading (Requirement 15.1).
 *
 * Renders `columns` shimmer cells (plus an optional actions cell) using a
 * CSS pulse animation that matches the DataTable row card style.
 */
export function SkeletonRow({ columns, hasActions = false }: SkeletonRowProps) {
  const totalCells = columns + (hasActions ? 1 : 0);

  // Mirror the DataTable row grid: equal columns + optional 60px actions column
  const gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr)) ${hasActions ? "60px" : ""}`;

  return (
    <div
      aria-hidden="true"
      className="grid items-center px-6 py-4 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50"
      style={{ gridTemplateColumns }}
    >
      {Array.from({ length: totalCells }).map((_, i) => (
        <div key={i} className="flex items-center pr-4">
          <div
            className={`h-4 bg-gray-200 rounded-full animate-pulse ${
              // Vary widths so the skeleton looks more natural
              i % 3 === 0 ? "w-3/4" : i % 3 === 1 ? "w-1/2" : "w-2/3"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

// ─── SkeletonTable ────────────────────────────────────────────────────────────

export interface SkeletonTableProps {
  /** Number of skeleton rows to render. Defaults to 5. */
  rows?: number;
  /** Number of columns per row */
  columns: number;
  /** Whether to include an actions column */
  hasActions?: boolean;
}

/**
 * Convenience wrapper that renders multiple SkeletonRow components.
 * Use this inside a DataTable's loading branch.
 */
export function SkeletonTable({
  rows = 5,
  columns,
  hasActions = false,
}: SkeletonTableProps) {
  return (
    <div
      className="flex flex-col gap-3"
      role="status"
      aria-label="Loading data"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} columns={columns} hasActions={hasActions} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

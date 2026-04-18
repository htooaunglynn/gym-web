"use client";

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type EquipmentCondition = "NEW" | "GOOD" | "FAIR" | "POOR";

export interface StatusBadgeProps {
  status: SubscriptionStatus | PaymentStatus | EquipmentCondition | null | undefined;
  variant?: "subscription" | "payment" | "equipment";
}

// ─── Color maps ───────────────────────────────────────────────────────────────

/**
 * Returns Tailwind classes for statuses that map to standard palette colors.
 * Returns null when the status requires an exact hex color (handled via inline style).
 */
function getTailwindClasses(
  status: string,
  variant: "subscription" | "payment" | "equipment" | undefined,
): string | null {
  // Equipment conditions that need exact hex colors are handled separately
  if (variant === "equipment" || isEquipmentCondition(status)) {
    if (status === "NEW" || status === "POOR") return null; // use inline styles
    if (status === "GOOD") return "bg-blue-100 text-blue-800";
    if (status === "FAIR") return "bg-yellow-100 text-yellow-800";
  }

  // Subscription statuses
  if (
    variant === "subscription" ||
    (!variant && isSubscriptionStatus(status))
  ) {
    switch (status as SubscriptionStatus) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-700";
      case "EXPIRED":
        return "bg-red-100 text-red-800";
    }
  }

  // Payment statuses
  if (variant === "payment" || (!variant && isPaymentStatus(status))) {
    switch (status as PaymentStatus) {
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
    }
  }

  // Fallback
  return "bg-gray-100 text-gray-700";
}

/**
 * Returns inline style for statuses that require exact hex colors.
 * Only used for EquipmentCondition NEW and POOR.
 */
function getInlineStyle(
  status: string,
  variant: "subscription" | "payment" | "equipment" | undefined,
): React.CSSProperties | undefined {
  const isEquip = variant === "equipment" || isEquipmentCondition(status);
  if (!isEquip) return undefined;

  if (status === "NEW") {
    return { backgroundColor: "#103c25", color: "#ffffff" };
  }
  if (status === "POOR") {
    return { backgroundColor: "#9e0a0a", color: "#ffffff" };
  }
  return undefined;
}

// ─── Type guards ──────────────────────────────────────────────────────────────

function isSubscriptionStatus(s: string): s is SubscriptionStatus {
  return ["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"].includes(s);
}

function isPaymentStatus(s: string): s is PaymentStatus {
  return ["PENDING", "PAID", "FAILED", "REFUNDED"].includes(s);
}

function isEquipmentCondition(s: string): s is EquipmentCondition {
  return ["NEW", "GOOD", "FAIR", "POOR"].includes(s);
}

// ─── Human-readable labels ────────────────────────────────────────────────────

function getLabel(status: string | null | undefined): string {
  if (!status) return "Unknown";
  // Convert SCREAMING_SNAKE_CASE to Title Case
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * A styled pill badge that renders a status value with a color-coded background.
 * Handles SubscriptionStatus, PaymentStatus, and EquipmentCondition variants.
 *
 * For EquipmentCondition NEW and POOR, exact hex colors are applied via inline
 * styles as required by Requirement 8.2.
 */
export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const safeStatus = status ?? "";
  const tailwindClasses = safeStatus ? getTailwindClasses(safeStatus, variant) : "bg-gray-100 text-gray-500";
  const inlineStyle = safeStatus ? getInlineStyle(safeStatus, variant) : undefined;

  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap";

  return (
    <span
      className={`${baseClasses} ${tailwindClasses ?? ""}`}
      style={inlineStyle}
    >
      {getLabel(status)}
    </span>
  );
}

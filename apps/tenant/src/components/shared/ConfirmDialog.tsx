"use client";

import React, { useEffect, useRef, useCallback } from "react";

export interface ConfirmDialogProps {
  /** Whether the dialog is currently open */
  open: boolean;
  /** Dialog title, e.g. "Delete Member" */
  title: string;
  /** Descriptive message asking the user to confirm */
  message: string;
  /** Label for the confirm (destructive) button. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
  /** Called when the user confirms the action */
  onConfirm: () => void;
  /** Called when the user cancels or presses Escape */
  onCancel: () => void;
  /** Whether the confirm action is in progress (disables buttons) */
  isLoading?: boolean;
}

/**
 * A reusable confirmation dialog for destructive actions (delete, cancel
 * subscription, etc.).
 *
 * - Confirm button uses Pinterest Red (#e60023) per the design system.
 * - Cancel button uses sand gray (#e5e5e0).
 * - Pressing Escape closes the dialog (calls onCancel).
 * - Focus is trapped inside the dialog while it is open.
 * - Meets Requirement 15.6 (Escape key close) and 15.9 (keyboard navigation).
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }

      // Focus trap: keep Tab/Shift+Tab inside the dialog
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [open, onCancel],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Move focus to the cancel button when the dialog opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure the dialog is rendered before focusing
      const timer = setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Semi-transparent overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onCancel}
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative z-10 w-full max-w-md bg-white rounded-[20px] shadow-2xl p-6 flex flex-col gap-5"
      >
        {/* Title */}
        <h2
          id="confirm-dialog-title"
          className="text-lg font-bold text-[#211922]"
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="confirm-dialog-message"
          className="text-sm text-gray-600 leading-relaxed"
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          {/* Cancel button — sand gray secondary style */}
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-semibold text-[#211922] bg-[#e5e5e0] rounded-[16px] border border-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#211922]"
          >
            {cancelLabel}
          </button>

          {/* Confirm button — Pinterest Red destructive style */}
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#e60023] rounded-[16px] hover:bg-[#c4001f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e60023]"
          >
            {isLoading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

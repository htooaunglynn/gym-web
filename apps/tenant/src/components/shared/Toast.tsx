"use client";

import React, { useEffect, useRef } from "react";
import { useToast, type Toast, type ToastType } from "@/contexts/ToastContext";

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function CheckIcon() {
    return (
        <svg
            aria-hidden="true"
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg
            aria-hidden="true"
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
        </svg>
    );
}

function WarningIcon() {
    return (
        <svg
            aria-hidden="true"
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
}

// ─── Per-type styles ──────────────────────────────────────────────────────────

const STYLES: Record<
    ToastType,
    { container: string; icon: React.ReactNode; progress: string }
> = {
    success: {
        container: "bg-[#103c25] text-white border border-green-700",
        icon: <CheckIcon />,
        progress: "bg-green-400",
    },
    error: {
        container: "bg-[#9e0a0a] text-white border border-red-700",
        icon: <ErrorIcon />,
        progress: "bg-red-400",
    },
    warning: {
        container: "bg-amber-700 text-white border border-amber-600",
        icon: <WarningIcon />,
        progress: "bg-amber-300",
    },
};

// ─── Single toast item ────────────────────────────────────────────────────────

interface ToastItemProps {
    toast: Toast;
    onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
    const { container, icon, progress } = STYLES[toast.type];
    const progressRef = useRef<HTMLDivElement>(null);

    // Animate the progress bar for auto-dismiss toasts
    useEffect(() => {
        if (!toast.autoDismiss || !progressRef.current) return;
        const el = progressRef.current;
        // Start at 100% width and shrink to 0 over 3 s
        el.style.transition = "none";
        el.style.width = "100%";
        // Force reflow so the transition starts from 100%
        void el.offsetWidth;
        el.style.transition = "width 3s linear";
        el.style.width = "0%";
    }, [toast.autoDismiss]);

    return (
        <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className={`relative flex items-start gap-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl px-4 py-3 shadow-lg overflow-hidden ${container}`}
        >
            {/* Icon */}
            <span className="mt-0.5">{icon}</span>

            {/* Message */}
            <p className="flex-1 text-sm leading-snug break-words">{toast.message}</p>

            {/* Dismiss button */}
            <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => onDismiss(toast.id)}
                className="mt-0.5 shrink-0 opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
                <CloseIcon />
            </button>

            {/* Progress bar (auto-dismiss only) */}
            {toast.autoDismiss && (
                <div
                    ref={progressRef}
                    className={`absolute bottom-0 left-0 h-0.5 ${progress}`}
                    style={{ width: "100%" }}
                />
            )}
        </div>
    );
}

// ─── Toast container ──────────────────────────────────────────────────────────

/**
 * Renders all active toasts in a fixed bottom-right stack.
 * Mount this once near the root of the app (inside ToastProvider).
 */
export function ToastContainer() {
    const { toasts, dismissToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div
            aria-label="Notifications"
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
        >
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onDismiss={dismissToast} />
                </div>
            ))}
        </div>
    );
}

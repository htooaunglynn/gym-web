"use client";

import React from "react";
import { useToastContext } from "@/context/ToastContext";
import { Button } from "./Button";

export function ToastContainer() {
    const { toasts, removeToast } = useToastContext();

    return (
        <div
            className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
            aria-live="polite"
            aria-atomic="true"
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    role={toast.type === "error" ? "alert" : "status"}
                    className={`
            pointer-events-auto
            min-w-80 max-w-sm
            rounded-md p-4
            shadow-ambient
            flex items-start gap-4
            animate-in fade-in slide-in-from-right-2
            exit:animate-out fade-out slide-out-to-right-2
            transition-all
            ${{
                            success: "bg-secondary/10 border border-secondary/30 text-secondary",
                            error: "bg-error/10 border border-error/30 text-error",
                            info: "bg-primary/10 border border-primary/30 text-primary",
                            warning: "bg-tertiary/10 border border-tertiary/30 text-tertiary",
                        }[toast.type]
                        }
          `}
                >
                    <div className="flex-1">
                        <p className="font-semibold text-body-md">{toast.title}</p>
                        {toast.message && (
                            <p className="text-label-md opacity-75 mt-1">{toast.message}</p>
                        )}
                        {toast.action && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    toast.action?.onClick();
                                    removeToast(toast.id);
                                }}
                                className="mt-2 text-inherit hover:opacity-75"
                            >
                                {toast.action.label}
                            </Button>
                        )}
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-inherit opacity-50 hover:opacity-100 transition-opacity"
                        aria-label="Close notification"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}

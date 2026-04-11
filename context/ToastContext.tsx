"use client";

import React, { createContext, useContext, useCallback, useState } from "react";

export interface Toast {
    id: string;
    title: string;
    message?: string;
    type: "success" | "error" | "info" | "warning";
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Date.now().toString();
        const newToast: Toast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        if (toast.duration !== Infinity) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 5000);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return {
        success: (title: string, message?: string, action?: Toast["action"]) =>
            context.addToast({ title, message, type: "success", action }),
        error: (title: string, message?: string, action?: Toast["action"]) =>
            context.addToast({ title, message, type: "error", action }),
        info: (title: string, message?: string) =>
            context.addToast({ title, message, type: "info" }),
        warning: (title: string, message?: string) =>
            context.addToast({ title, message, type: "warning" }),
    };
}

export function useToastContext() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToastContext must be used within a ToastProvider");
    }
    return context;
}

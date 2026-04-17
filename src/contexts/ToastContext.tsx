"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { setToastDispatcher } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  /** true for success (auto-dismisses after 3 s), false for error/warning */
  autoDismiss: boolean;
}

export interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, autoDismiss?: boolean) => void;
  dismissToast: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;
function nextId(): string {
  return `toast-${++idCounter}-${Date.now()}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Keep a stable ref so the apiClient dispatcher closure never goes stale
  const showToastRef = useRef<ToastContextValue["showToast"] | null>(null);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType, autoDismiss?: boolean) => {
      // Default: success auto-dismisses, error/warning stays until dismissed
      const shouldAutoDismiss = autoDismiss ?? type === "success";
      const id = nextId();

      setToasts((prev) => [
        ...prev,
        { id, type, message, autoDismiss: shouldAutoDismiss },
      ]);

      if (shouldAutoDismiss) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
      }
    },
    [],
  );

  // Keep ref in sync
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // Register a stable dispatcher with apiClient once on mount
  useEffect(() => {
    setToastDispatcher((message, type) => {
      showToastRef.current?.(message, type);
    });
    return () => {
      // Clear dispatcher on unmount (e.g., during tests)
      setToastDispatcher(() => {});
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

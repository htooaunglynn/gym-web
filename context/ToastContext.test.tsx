import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    ToastProvider,
    useToast,
    useToastContext,
} from "@/context/ToastContext";

function ContextConsumer() {
    const { toasts, addToast, removeToast, clearToasts } = useToastContext();

    return (
        <>
            <button
                onClick={() =>
                    addToast({ title: "Saved", message: "Member updated", type: "success", duration: 1000 })
                }
            >
                Add toast
            </button>
            <button
                onClick={() =>
                    addToast({ title: "Persistent", type: "info", duration: Infinity })
                }
            >
                Add persistent toast
            </button>
            <button onClick={() => removeToast(toasts[0]?.id ?? "")}>Remove toast</button>
            <button onClick={clearToasts}>Clear toasts</button>
            <div data-testid="toast-count">{toasts.length}</div>
            {toasts.map((toast) => (
                <div key={toast.id}>
                    <span>{toast.title}</span>
                    <span>{toast.type}</span>
                    {toast.action && <button onClick={toast.action.onClick}>{toast.action.label}</button>}
                </div>
            ))}
        </>
    );
}

function ShortcutConsumer() {
    const toast = useToast();

    return (
        <>
            <button onClick={() => toast.success("Done", "Saved successfully")}>Success</button>
            <button onClick={() => toast.error("Failed", "Try again", { label: "Retry", onClick: vi.fn() })}>
                Error
            </button>
            <button onClick={() => toast.info("Heads up", "FYI")}>Info</button>
            <button onClick={() => toast.warning("Warning", "Check this")}>Warning</button>
            <ContextConsumer />
        </>
    );
}

describe("ToastContext", () => {
    beforeEach(() => {
        let idSeed = 1;
        vi.useFakeTimers();
        vi.spyOn(Date, "now").mockImplementation(() => idSeed++);
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("throws outside the provider", () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        expect(() => render(<ContextConsumer />)).toThrow("useToastContext must be used within a ToastProvider");
        consoleSpy.mockRestore();
    });

    it("adds and auto-removes a toast after the configured duration", () => {
        render(
            <ToastProvider>
                <ContextConsumer />
            </ToastProvider>,
        );

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /add toast/i }));
        });
        expect(screen.getByText("Saved")).toBeDefined();
        expect(screen.getByTestId("toast-count").textContent).toBe("1");

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.queryByText("Saved")).toBeNull();
        expect(screen.getByTestId("toast-count").textContent).toBe("0");
    });

    it("does not auto-remove persistent toasts and supports manual clear", () => {
        render(
            <ToastProvider>
                <ContextConsumer />
            </ToastProvider>,
        );

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /add persistent toast/i }));
            vi.advanceTimersByTime(60_000);
        });

        expect(screen.getByText("Persistent")).toBeDefined();
        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /clear toasts/i }));
        });
        expect(screen.queryByText("Persistent")).toBeNull();
    });

    it("supports convenience helpers and action payloads", () => {
        render(
            <ToastProvider>
                <ShortcutConsumer />
            </ToastProvider>,
        );

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /^success$/i }));
            fireEvent.click(screen.getByRole("button", { name: /^error$/i }));
            fireEvent.click(screen.getByRole("button", { name: /^info$/i }));
            fireEvent.click(screen.getByRole("button", { name: /^warning$/i }));
        });

        expect(screen.getByText("success")).toBeDefined();
        expect(screen.getByText("error")).toBeDefined();
        expect(screen.getByText("info")).toBeDefined();
        expect(screen.getByText("warning")).toBeDefined();
        expect(screen.getByRole("button", { name: /retry/i })).toBeDefined();

        act(() => {
            vi.runOnlyPendingTimers();
        });
    });
});

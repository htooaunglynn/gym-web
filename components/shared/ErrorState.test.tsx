import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ErrorState } from "@/components/shared/ErrorState";

describe("ErrorState", () => {
    it("renders default title and message", () => {
        render(<ErrorState />);
        expect(screen.getByText("Something went wrong")).toBeDefined();
        expect(screen.getByText(/An error occurred/i)).toBeDefined();
    });

    it("renders custom title and message", () => {
        render(<ErrorState title="Not Found" message="The page does not exist." />);
        expect(screen.getByText("Not Found")).toBeDefined();
        expect(screen.getByText("The page does not exist.")).toBeDefined();
    });

    it("renders retry button when onRetry is provided", () => {
        render(<ErrorState onRetry={() => { }} />);
        expect(screen.getByRole("button", { name: /try again/i })).toBeDefined();
    });

    it("does not render retry button without onRetry", () => {
        render(<ErrorState />);
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("calls onRetry when Try Again is clicked", async () => {
        const user = userEvent.setup();
        const onRetry = vi.fn();
        render(<ErrorState onRetry={onRetry} />);
        await user.click(screen.getByRole("button", { name: /try again/i }));
        expect(onRetry).toHaveBeenCalledOnce();
    });

    it("has role='alert' for accessibility", () => {
        render(<ErrorState />);
        expect(screen.getByRole("alert")).toBeDefined();
    });
});

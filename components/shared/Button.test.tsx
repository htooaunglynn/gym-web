import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Button } from "@/components/shared/Button";

describe("Button", () => {
    it("renders children text", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", { name: /click me/i })).toBeDefined();
    });

    it("is disabled when disabled prop is passed", () => {
        render(<Button disabled>Click me</Button>);
        const btn = screen.getByRole("button");
        expect((btn as HTMLButtonElement).disabled).toBe(true);
    });

    it("is disabled when isLoading is true", () => {
        render(<Button isLoading>Click me</Button>);
        const btn = screen.getByRole("button");
        expect((btn as HTMLButtonElement).disabled).toBe(true);
    });

    it("shows a spinner svg when isLoading is true", () => {
        render(<Button isLoading>Loading</Button>);
        // SVG spinner should be in the DOM
        const svgs = document.querySelectorAll("svg");
        expect(svgs.length).toBeGreaterThan(0);
    });

    it("fires onClick when clicked", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);
        await user.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("does not fire onClick when disabled", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button disabled onClick={onClick}>Click</Button>);
        await user.click(screen.getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
    });

    it("applies variant class to secondary button", () => {
        render(<Button variant="secondary">Secondary</Button>);
        const btn = screen.getByRole("button");
        expect((btn as HTMLButtonElement).className).toMatch(/surface/);
    });
});

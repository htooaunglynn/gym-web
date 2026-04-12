import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/shared/Input";

describe("Input", () => {
    it("associates the label with the generated input id", () => {
        render(<Input label="Email" placeholder="name@example.com" />);

        expect(screen.getByLabelText(/email/i)).toBeDefined();
    });

    it("uses the provided id and helper text for accessibility", () => {
        render(<Input id="member-email" label="Email" helperText="Work email only" />);

        const input = screen.getByLabelText(/email/i);
        expect(input.getAttribute("id")).toBe("member-email");
        expect(input.getAttribute("aria-describedby")).toBe("member-email-helper");
        expect(screen.getByText("Work email only")).toBeDefined();
    });

    it("shows an alert and marks the input invalid when an error exists", () => {
        render(<Input id="member-name" label="Name" error="Name is required" helperText="Ignored" />);

        const input = screen.getByLabelText(/name/i);
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(input.getAttribute("aria-describedby")).toBe("member-name-error");
        expect(screen.getByRole("alert")).toBeDefined();
        expect(screen.queryByText("Ignored")).toBeNull();
    });

    it("merges the custom class name", () => {
        render(<Input label="Phone" className="custom-input" />);

        expect(screen.getByLabelText(/phone/i).className).toMatch(/custom-input/);
    });
});

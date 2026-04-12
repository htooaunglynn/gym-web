import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

describe("LoadingSpinner", () => {
    it("has role='status' for accessibility", () => {
        render(<LoadingSpinner />);
        expect(screen.getByRole("status")).toBeDefined();
    });

    it("renders optional text", () => {
        render(<LoadingSpinner text="Loading data..." />);
        expect(screen.getByText("Loading data...")).toBeDefined();
    });

    it("renders without text by default (no visible text)", () => {
        render(<LoadingSpinner />);
        expect(screen.queryByText("Loading")).toBeDefined();
    });

    it("applies sm size class when size='sm'", () => {
        const { container } = render(<LoadingSpinner size="sm" />);
        const svg = container.querySelector("svg");
        expect((svg as SVGElement).className.baseVal).toMatch(/w-6/);
    });

    it("applies lg size class when size='lg'", () => {
        const { container } = render(<LoadingSpinner size="lg" />);
        const svg = container.querySelector("svg");
        expect((svg as SVGElement).className.baseVal).toMatch(/w-16/);
    });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Badge } from "@/components/shared/Badge";

describe("Badge", () => {
    it("renders children text", () => {
        render(<Badge>Active</Badge>);
        expect(screen.getByText("Active")).toBeDefined();
    });

    it("applies success variant classes", () => {
        render(<Badge variant="success">OK</Badge>);
        const el = screen.getByText("OK");
        expect((el as HTMLElement).className).toMatch(/secondary/);
    });

    it("applies error variant classes", () => {
        render(<Badge variant="error">Error</Badge>);
        const el = screen.getByText("Error");
        expect((el as HTMLElement).className).toMatch(/error/);
    });

    it("applies warning variant classes", () => {
        render(<Badge variant="warning">Warn</Badge>);
        const el = screen.getByText("Warn");
        expect((el as HTMLElement).className).toMatch(/tertiary/);
    });

    it("applies info variant classes", () => {
        render(<Badge variant="info">Info</Badge>);
        const el = screen.getByText("Info");
        expect((el as HTMLElement).className).toMatch(/primary/);
    });

    it("renders with md size", () => {
        render(<Badge size="md">Large</Badge>);
        const el = screen.getByText("Large");
        expect((el as HTMLElement).className).toMatch(/body-md/);
    });
});

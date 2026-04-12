import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Pagination } from "@/components/shared/Pagination";

describe("Pagination", () => {
    const defaultProps = {
        currentPage: 1,
        totalItems: 30,
        pageSize: 10,
        onPageChange: vi.fn(),
    };

    it("renders 'Showing X-Y of Z' info text", () => {
        render(<Pagination {...defaultProps} />);
        expect(screen.getByText(/Showing 1-10 of 30/)).toBeDefined();
    });

    it("renders nothing when totalItems ≤ pageSize", () => {
        const { container } = render(
            <Pagination currentPage={1} totalItems={5} pageSize={10} onPageChange={vi.fn()} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("disables Previous button on first page", () => {
        render(<Pagination {...defaultProps} currentPage={1} />);
        const prev = screen.getByRole("button", { name: /previous/i });
        expect((prev as HTMLButtonElement).disabled).toBe(true);
    });

    it("disables Next button on last page", () => {
        render(<Pagination {...defaultProps} currentPage={3} totalItems={30} pageSize={10} />);
        const next = screen.getByRole("button", { name: /next/i });
        expect((next as HTMLButtonElement).disabled).toBe(true);
    });

    it("calls onPageChange with next page when Next is clicked", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);
        await user.click(screen.getByRole("button", { name: /next/i }));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("calls onPageChange with previous page when Previous is clicked", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);
        await user.click(screen.getByRole("button", { name: /previous/i }));
        expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("displays current page out of total pages", () => {
        render(<Pagination {...defaultProps} currentPage={2} totalItems={30} pageSize={10} />);
        expect(screen.getByText(/Page 2 \/ 3/)).toBeDefined();
    });
});

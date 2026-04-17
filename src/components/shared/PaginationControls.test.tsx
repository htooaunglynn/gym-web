/**
 * Unit + property-based tests for PaginationControls
 * Validates: Requirements 15.8
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import fc from "fast-check";
import { PaginationControls } from "./PaginationControls";

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe("PaginationControls – disabled states", () => {
  it("disables Prev on page 1", () => {
    render(
      <PaginationControls
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    );
    const prev = screen.getByRole("button", { name: /previous/i });
    expect(prev).toBeDisabled();
  });

  it("disables Next on last page", () => {
    render(
      <PaginationControls
        currentPage={5}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    );
    const next = screen.getByRole("button", { name: /next/i });
    expect(next).toBeDisabled();
  });

  it("enables both buttons on a middle page", () => {
    render(
      <PaginationControls
        currentPage={3}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).not.toBeDisabled();
  });

  it("disables both Prev and Next when totalPages is 1", () => {
    render(
      <PaginationControls
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});

describe("PaginationControls – page change callbacks", () => {
  it("calls onPageChange with currentPage - 1 when Prev is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with currentPage + 1 when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("does not call onPageChange when Prev is clicked on page 1", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not call onPageChange when Next is clicked on last page", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls
        currentPage={5}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

describe("PaginationControls – display", () => {
  it('shows "Page X of Y" text', () => {
    render(
      <PaginationControls
        currentPage={2}
        totalPages={7}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Page 2 of 7")).toBeDefined();
  });

  it("renders nothing when totalPages is 0", () => {
    const { container } = render(
      <PaginationControls
        currentPage={1}
        totalPages={0}
        onPageChange={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});

// ─── Property-based tests ─────────────────────────────────────────────────────

/**
 * Property 12: Pagination controls disabled states are always correct
 * Validates: Requirements 15.8
 */
describe("Property 12 – Pagination disabled states are always correct", () => {
  it("Prev disabled iff currentPage === 1, Next disabled iff currentPage === totalPages", () => {
    fc.assert(
      fc.property(
        fc
          .integer({ min: 1, max: 100 })
          .chain((total) =>
            fc.tuple(fc.integer({ min: 1, max: total }), fc.constant(total)),
          ),
        ([currentPage, totalPages]) => {
          const { unmount } = render(
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={vi.fn()}
            />,
          );

          const prev = screen.getByRole("button", { name: /previous/i });
          const next = screen.getByRole("button", { name: /next/i });

          if (currentPage === 1) {
            expect(prev).toBeDisabled();
          } else {
            expect(prev).not.toBeDisabled();
          }

          if (currentPage === totalPages) {
            expect(next).toBeDisabled();
          } else {
            expect(next).not.toBeDisabled();
          }

          unmount();
        },
      ),
      { numRuns: 100 },
    );
  });
});

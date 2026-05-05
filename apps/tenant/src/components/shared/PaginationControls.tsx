"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

/**
 * Pagination controls showing current page, total pages, and prev/next buttons.
 *
 * - Prev button is disabled when currentPage === 1 (Requirement 15.8)
 * - Next button is disabled when currentPage === totalPages (Requirement 15.8)
 * - Matches the project's button styling: sand gray secondary buttons, 16px border-radius
 */
export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationControlsProps) {
    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    const handlePrev = () => {
        if (!isFirstPage) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (!isLastPage) {
            onPageChange(currentPage + 1);
        }
    };

    // Don't render if there's nothing to paginate
    if (totalPages <= 0) return null;

    return (
        <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 py-4"
            role="navigation"
            aria-label="Pagination"
        >
            {/* Prev button */}
            <button
                type="button"
                onClick={handlePrev}
                disabled={isFirstPage}
                aria-label="Go to previous page"
                aria-disabled={isFirstPage}
                className={`
          flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
          rounded-[16px] border transition-colors
          ${isFirstPage
                        ? "bg-[#e5e5e0] text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                        : "bg-[#e5e5e0] text-[#211922] border-gray-200 hover:bg-gray-300 cursor-pointer"
                    }
        `}
            >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Prev
            </button>

            {/* Page indicator */}
            <span
                className="text-sm font-semibold text-[#211922] min-w-[110px] text-center bg-[#f3f2ee] px-3 py-2 rounded-xl"
                aria-live="polite"
                aria-atomic="true"
            >
                Page {currentPage} of {totalPages}
            </span>

            {/* Next button */}
            <button
                type="button"
                onClick={handleNext}
                disabled={isLastPage}
                aria-label="Go to next page"
                aria-disabled={isLastPage}
                className={`
          flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
          rounded-[16px] border transition-colors
          ${isLastPage
                        ? "bg-[#e5e5e0] text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                        : "bg-[#e5e5e0] text-[#211922] border-gray-200 hover:bg-gray-300 cursor-pointer"
                    }
        `}
            >
                Next
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
        </div>
    );
}

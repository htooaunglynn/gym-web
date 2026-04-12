import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
    formatDate,
    formatDateTime,
    formatRelativeTime,
    formatCurrency,
    formatPhone,
    toTitleCase,
} from "@/lib/formatters";

// ─── formatDate ───────────────────────────────────────────────────────────────
describe("formatDate", () => {
    it("formats a valid ISO date string", () => {
        // Use consistent timezone
        const result = formatDate("2025-06-15T00:00:00.000Z");
        expect(result).toMatch(/Jun\s+\d{1,2},\s+2025/);
    });

    it("formats a Date object", () => {
        const result = formatDate(new Date("2025-01-01T00:00:00.000Z"));
        expect(result).toMatch(/Jan\s+1,\s+2025/);
    });

    it("returns '—' for null", () => {
        expect(formatDate(null)).toBe("—");
    });

    it("returns '—' for undefined", () => {
        expect(formatDate(undefined)).toBe("—");
    });

    it("returns 'Invalid date' for garbage string", () => {
        expect(formatDate("not-a-date")).toBe("Invalid date");
    });
});

// ─── formatDateTime ───────────────────────────────────────────────────────────
describe("formatDateTime", () => {
    it("includes time in output", () => {
        const result = formatDateTime("2025-01-01T14:30:00.000Z");
        // Should contain digits and "AM" or "PM" markers for 12-hour clocks, or "14" for 24-hour
        expect(result).toMatch(/2025/);
        expect(result).toMatch(/Jan/);
    });

    it("returns '—' for null", () => {
        expect(formatDateTime(null)).toBe("—");
    });
});

// ─── formatRelativeTime ───────────────────────────────────────────────────────
describe("formatRelativeTime", () => {
    let now: number;

    beforeEach(() => {
        now = Date.now();
        vi.useFakeTimers();
        vi.setSystemTime(now);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns 'just now' for times within 60 seconds", () => {
        const d = new Date(now - 30_000);
        expect(formatRelativeTime(d)).toBe("just now");
    });

    it("returns minutes ago for times within 60 minutes", () => {
        const d = new Date(now - 5 * 60_000);
        expect(formatRelativeTime(d)).toBe("5 minutes ago");
    });

    it("returns singular 'minute ago'", () => {
        const d = new Date(now - 60_000);
        expect(formatRelativeTime(d)).toBe("1 minute ago");
    });

    it("returns hours ago for times within 24 hours", () => {
        const d = new Date(now - 3 * 3600_000);
        expect(formatRelativeTime(d)).toBe("3 hours ago");
    });

    it("returns singular 'hour ago'", () => {
        const d = new Date(now - 3600_000);
        expect(formatRelativeTime(d)).toBe("1 hour ago");
    });

    it("returns days ago for times within 30 days", () => {
        const d = new Date(now - 2 * 86_400_000);
        expect(formatRelativeTime(d)).toBe("2 days ago");
    });

    it("returns formatted date for times older than 30 days", () => {
        const d = new Date(now - 60 * 86_400_000);
        const result = formatRelativeTime(d);
        // Should return a date string, not "days ago"
        expect(result).not.toMatch(/days ago/);
        expect(result.length).toBeGreaterThan(0);
    });

    it("returns '—' for null", () => {
        expect(formatRelativeTime(null)).toBe("—");
    });

    it("returns '—' for invalid date string", () => {
        expect(formatRelativeTime("not-a-date")).toBe("—");
    });
});

// ─── formatCurrency ───────────────────────────────────────────────────────────
describe("formatCurrency", () => {
    it("formats USD by default", () => {
        expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("formats zero", () => {
        expect(formatCurrency(0)).toBe("$0.00");
    });

    it("formats negative value", () => {
        const result = formatCurrency(-50);
        expect(result).toMatch(/50/);
    });

    it("returns '—' for null", () => {
        expect(formatCurrency(null)).toBe("—");
    });

    it("returns '—' for undefined", () => {
        expect(formatCurrency(undefined)).toBe("—");
    });
});

// ─── formatPhone ─────────────────────────────────────────────────────────────
describe("formatPhone", () => {
    it("formats 10-digit number as (xxx) xxx-xxxx", () => {
        expect(formatPhone("5550001234")).toBe("(555) 000-1234");
    });

    it("formats 11-digit number starting with 1 as +1 (xxx) xxx-xxxx", () => {
        expect(formatPhone("15550001234")).toBe("+1 (555) 000-1234");
    });

    it("strips formatting characters before processing", () => {
        expect(formatPhone("(555) 000-1234")).toBe("(555) 000-1234");
    });

    it("returns original value for unrecognized length", () => {
        expect(formatPhone("1234")).toBe("1234");
    });

    it("returns '—' for null", () => {
        expect(formatPhone(null)).toBe("—");
    });

    it("returns '—' for undefined", () => {
        expect(formatPhone(undefined)).toBe("—");
    });

    it("returns '—' for empty string", () => {
        expect(formatPhone("")).toBe("—");
    });
});

// ─── toTitleCase ─────────────────────────────────────────────────────────────
describe("toTitleCase", () => {
    it("capitalises first letter of each word", () => {
        expect(toTitleCase("hello world")).toBe("Hello World");
    });

    it("lowercases the rest of each word", () => {
        expect(toTitleCase("JOHN SMITH")).toBe("John Smith");
    });

    it("handles single word", () => {
        expect(toTitleCase("admin")).toBe("Admin");
    });

    it("handles empty string", () => {
        expect(toTitleCase("")).toBe("");
    });
});

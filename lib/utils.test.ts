import { describe, it, expect } from "vitest";
import { cn, getInitials, truncate, buildQueryString, isNonEmptyString } from "@/lib/utils";

describe("cn", () => {
    it("returns merged class string", () => {
        expect(cn("px-2", "py-2")).toBe("px-2 py-2");
    });

    it("resolves Tailwind conflicts — last wins", () => {
        expect(cn("px-2", "px-4")).toBe("px-4");
    });

    it("handles falsy values without crashing", () => {
        expect(cn("px-2", undefined, false, null as unknown as string)).toBe("px-2");
    });
});

describe("getInitials", () => {
    it("returns first letter of each word, up to 2 chars", () => {
        expect(getInitials("Alice Smith")).toBe("AS");
    });

    it("returns single letter for single-word name", () => {
        expect(getInitials("Alice")).toBe("A");
    });

    it("truncates to 2 chars for multi-word names", () => {
        expect(getInitials("Alice Bob Carol")).toBe("AB");
    });

    it("uppercases the result", () => {
        expect(getInitials("alice smith")).toBe("AS");
    });

    it("returns '?' for null", () => {
        expect(getInitials(null)).toBe("?");
    });

    it("returns '?' for undefined", () => {
        expect(getInitials(undefined)).toBe("?");
    });

    it("returns '?' for empty string", () => {
        expect(getInitials("")).toBe("?");
    });

    it("handles extra whitespace", () => {
        expect(getInitials("  John   Doe  ")).toBe("JD");
    });
});

describe("truncate", () => {
    it("returns string unchanged when at exact length", () => {
        expect(truncate("hello", 5)).toBe("hello");
    });

    it("returns string unchanged when shorter than maxLength", () => {
        expect(truncate("hi", 10)).toBe("hi");
    });

    it("truncates and appends ellipsis when over maxLength", () => {
        expect(truncate("hello world", 5)).toBe("hello…");
    });

    it("truncates to 0 characters", () => {
        expect(truncate("hello", 0)).toBe("…");
    });
});

describe("buildQueryString", () => {
    it("returns empty string when all values are null/undefined", () => {
        expect(buildQueryString({ a: null, b: undefined })).toBe("");
    });

    it("omits null and undefined values", () => {
        expect(buildQueryString({ a: "1", b: null, c: undefined })).toBe("?a=1");
    });

    it("includes boolean false values", () => {
        expect(buildQueryString({ active: false })).toBe("?active=false");
    });

    it("includes zero", () => {
        expect(buildQueryString({ page: 0 })).toBe("?page=0");
    });

    it("handles multiple params", () => {
        const qs = buildQueryString({ page: 1, limit: 10 });
        expect(qs).toBe("?page=1&limit=10");
    });

    it("returns empty string for empty object", () => {
        expect(buildQueryString({})).toBe("");
    });
});

describe("isNonEmptyString", () => {
    it("returns true for non-empty string", () => {
        expect(isNonEmptyString("hello")).toBe(true);
    });

    it("returns false for empty string", () => {
        expect(isNonEmptyString("")).toBe(false);
    });

    it("returns false for whitespace-only string", () => {
        expect(isNonEmptyString("   ")).toBe(false);
    });

    it("returns false for number", () => {
        expect(isNonEmptyString(42)).toBe(false);
    });

    it("returns false for null", () => {
        expect(isNonEmptyString(null)).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isNonEmptyString(undefined)).toBe(false);
    });

    it("returns false for object", () => {
        expect(isNonEmptyString({})).toBe(false);
    });
});

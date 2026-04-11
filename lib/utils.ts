import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names without conflicts */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/** Return initials from a full name (up to 2 chars) */
export function getInitials(name: string | null | undefined): string {
    if (!name) return "?";
    return name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

/** Truncate a string to maxLength, appending "…" */
export function truncate(value: string, maxLength: number): string {
    return value.length <= maxLength ? value : `${value.slice(0, maxLength)}…`;
}

/** Build a query string from an object, omitting undefined/null values */
export function buildQueryString(
    params: Record<string, string | number | boolean | undefined | null>
): string {
    const qs = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
        if (val !== undefined && val !== null) {
            qs.append(key, String(val));
        }
    }
    const str = qs.toString();
    return str ? `?${str}` : "";
}

/** Sleep for a given number of milliseconds (use sparingly) */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Check whether a value is a non-empty string */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

/** Format a date string / Date object to a localised display string */
export function formatDate(
    value: string | Date | null | undefined,
    options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    }
): string {
    if (!value) return "—";
    const d = typeof value === "string" ? new Date(value) : value;
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleDateString("en-US", options);
}

/** Format a date + time */
export function formatDateTime(value: string | Date | null | undefined): string {
    return formatDate(value, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/** Return a human-readable relative time ("2 hours ago", "just now") */
export function formatRelativeTime(value: string | Date | null | undefined): string {
    if (!value) return "—";
    const d = typeof value === "string" ? new Date(value) : value;
    if (isNaN(d.getTime())) return "—";

    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;

    return formatDate(d);
}

/** Format a number as USD currency */
export function formatCurrency(
    value: number | null | undefined,
    currency = "USD",
    locale = "en-US"
): string {
    if (value == null) return "—";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(value);
}

/** Format a phone number to (xxx) xxx-xxxx when possible */
export function formatPhone(value: string | null | undefined): string {
    if (!value) return "—";
    const digits = value.replace(/\D/g, "");
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits[0] === "1") {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return value;
}

/** Capitalise first letter of each word */
export function toTitleCase(value: string): string {
    return value
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

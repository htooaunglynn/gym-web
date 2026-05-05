/**
 * Centralized HTTP client for all API requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

export interface ApiClientOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined | null>;
    suppressErrorToastForStatuses?: number[];
}

export interface PaginationMeta {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginationResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export class ApiClientError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiClientError";
        this.status = status;
    }
}

type ListResponse<T> = PaginationResponse<T> | { data: T[] } | T[];

export function normalizeListResponse<T>(response: ListResponse<T>): {
    data: T[];
    meta: PaginationMeta;
} {
    if (Array.isArray(response)) {
        return {
            data: response,
            meta: {
                totalItems: response.length,
                page: 1,
                limit: response.length,
                totalPages: 1,
            },
        };
    }

    const data = response.data ?? [];
    const hasMeta = "meta" in response;

    return {
        data,
        meta: hasMeta
            ? response.meta
            : {
                totalItems: data.length,
                page: 1,
                limit: data.length,
                totalPages: 1,
            },
    };
}

// Module-level toast dispatcher that will be set by ToastContext
let toastDispatcher:
    | ((message: string, type: "success" | "error" | "warning") => void)
    | null = null;

export function setToastDispatcher(
    dispatcher: (message: string, type: "success" | "error" | "warning") => void,
) {
    toastDispatcher = dispatcher;
}

function showToast(message: string, type: "success" | "error" | "warning") {
    if (toastDispatcher) {
        toastDispatcher(message, type);
    } else {
        // Fallback to console if toast system not initialized
        console[type === "error" ? "error" : "log"](
            `[${type.toUpperCase()}] ${message}`,
        );
    }
}

/**
 * Helper to handle API errors consistently
 */
async function handleResponseError(response: Response, suppressErrorToastForStatuses: number[], path: string) {
    const errorData = await response.json().catch(() => ({}));
    const status = response.status;
    const shouldShowToast = !suppressErrorToastForStatuses.includes(status);

    let message = errorData.message || `Request failed with status ${status}`;

    switch (status) {
        case 400:
            if (shouldShowToast) {
                if (Array.isArray(errorData.message)) {
                    message = errorData.message.join("; ");
                    showToast(message, "error");
                } else {
                    showToast(message, "error");
                }
            }
            break;
        case 401:
            if (path !== "/auth/login") {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                }
            }
            break;
        case 403:
        case 404:
        case 409:
            if (shouldShowToast) {
                showToast(message, "error");
            }
            break;
        default:
            if (status >= 500) {
                message = "An unexpected server error occurred. Please try again.";
                if (shouldShowToast) {
                    showToast(message, "error");
                }
            } else if (shouldShowToast) {
                showToast(message, "error");
            }
    }

    throw new ApiClientError(message, status);
}

/**
 * Centralized API client with automatic token attachment and error handling
 */
export async function apiClient<T>(
    path: string,
    options: ApiClientOptions = {},
): Promise<T> {
    const { params, suppressErrorToastForStatuses = [], ...fetchOptions } = options;

    // Build URL with query parameters
    let url = `${API_BASE_URL}${path}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    // Attach headers
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const activeBranchId = localStorage.getItem("activeBranchId");
        if (activeBranchId) {
            headers["x-branch-id"] = activeBranchId;
        }
    }

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        if (!response.ok) {
            await handleResponseError(response, suppressErrorToastForStatuses, path);
        }

        return await response.json() as T;
    } catch (error) {
        if (error instanceof ApiClientError) throw error;

        // Network errors
        if (error instanceof TypeError && (error.message.toLowerCase().includes("fetch") || error.message.toLowerCase().includes("network"))) {
            const message = "Unable to reach the server. Check your connection.";
            showToast(message, "error");
            throw new ApiClientError(message, 0);
        }
        throw error;
    }
}


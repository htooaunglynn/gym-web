/**
 * Centralized HTTP client for all API requests
 * Base URL: http://localhost:3000/api/v1
 */

const API_BASE_URL = "http://localhost:3000/api/v1";

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
 * Centralized API client with automatic token attachment and error handling
 */
export async function apiClient<T>(
    path: string,
    options: ApiClientOptions = {},
): Promise<T> {
    const { params, suppressErrorToastForStatuses, ...fetchOptions } = options;

    const shouldShowToast = (status: number): boolean =>
        !(suppressErrorToastForStatuses ?? []).includes(status);

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

    // Attach Bearer token from localStorage
    const token =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const activeBranchId =
        typeof window !== "undefined"
            ? localStorage.getItem("activeBranchId")
            : null;
    if (activeBranchId) {
        headers["x-branch-id"] = activeBranchId;
    }

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        // Handle HTTP error responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            switch (response.status) {
                case 400: {
                    // Validation errors - display each field error
                    if (shouldShowToast(response.status)) {
                        if (Array.isArray(errorData.message)) {
                            const errorMessages = errorData.message.join("; ");
                            showToast(errorMessages, "error");
                        } else {
                            showToast(errorData.message || "Invalid request", "error");
                        }
                    }
                    throw new ApiClientError(
                        errorData.message || "Validation error",
                        response.status,
                    );
                }

                case 401: {
                    const message = errorData.message || "Unauthorized";

                    // For login endpoint, let caller render inline credential errors.
                    if (path !== "/auth/login") {
                        if (typeof window !== "undefined") {
                            localStorage.removeItem("accessToken");
                            window.location.href = "/login";
                        }
                    }

                    throw new ApiClientError(message, response.status);
                }

                case 403: {
                    // Forbidden - show error but don't redirect
                    const message =
                        errorData.message ||
                        "You do not have permission to perform this action";
                    if (shouldShowToast(response.status)) {
                        showToast(message, "error");
                    }
                    throw new ApiClientError(message, response.status);
                }

                case 404: {
                    // Not found
                    const message = errorData.message || "Resource not found";
                    if (shouldShowToast(response.status)) {
                        showToast(message, "error");
                    }
                    throw new ApiClientError(message, response.status);
                }

                case 409: {
                    // Conflict (e.g., duplicate email/phone)
                    const message = errorData.message || "A conflict occurred";
                    if (shouldShowToast(response.status)) {
                        showToast(message, "error");
                    }
                    throw new ApiClientError(message, response.status);
                }

                default: {
                    // Handle all 5xx server errors generically
                    if (response.status >= 500) {
                        const message =
                            "An unexpected server error occurred. Please try again.";
                        if (shouldShowToast(response.status)) {
                            showToast(message, "error");
                        }
                        throw new ApiClientError(message, response.status);
                    }
                    const message =
                        errorData.message ||
                        `Request failed with status ${response.status}`;
                    if (shouldShowToast(response.status)) {
                        showToast(message, "error");
                    }
                    throw new ApiClientError(message, response.status);
                }
            }
        }

        // Success - parse and return JSON
        const data = await response.json();
        return data as T;
    } catch (error) {
        // Network errors (failed to fetch, connection refused, etc.)
        if (
            error instanceof TypeError &&
            (error.message.includes("fetch") ||
                error.message.includes("Failed to fetch") ||
                error.message.includes("NetworkError") ||
                error.message.includes("network"))
        ) {
            const message = "Unable to reach the server. Check your connection.";
            showToast(message, "error");
            throw new ApiClientError(message, 0);
        }
        // Re-throw other errors (already handled above)
        throw error;
    }
}

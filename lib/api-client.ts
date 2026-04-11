import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AppError } from "@/types/api";
import { ACCESS_TOKEN_KEY, CURRENT_USER_KEY } from "@/lib/constants";

const LEGACY_USER_KEY = "user";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

// ─── Axios Instance ──────────────────────────────────────────────────────────
export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30_000,
});

// ─── Request Interceptor — inject JWT ───────────────────────────────────────
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem(ACCESS_TOKEN_KEY);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ─── Response Interceptor — normalize errors ─────────────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const normalized = normalizeError(error);
        return Promise.reject(normalized);
    },
);

// ─── Error Normalizer ────────────────────────────────────────────────────────
export function normalizeError(error: unknown): AppError {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as Record<string, unknown> | undefined;
        const apiMessage = (data?.message as string) ?? null;

        if (status === 401) {
            // Clear stale token on 401
            if (typeof window !== "undefined") {
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                localStorage.removeItem(CURRENT_USER_KEY);
                localStorage.removeItem(LEGACY_USER_KEY);
            }
            return {
                code: "UNAUTHORIZED",
                userMessage: "Your session has expired. Please log in again.",
                isUnauthorized: true,
            };
        }

        if (status === 403) {
            return {
                code: "FORBIDDEN",
                userMessage: "You don't have permission to perform this action.",
                isPermissionDenied: true,
            };
        }

        if (status === 404) {
            return {
                code: "NOT_FOUND",
                userMessage: apiMessage ?? "The requested resource was not found.",
                isNotFound: true,
            };
        }

        if (status === 409) {
            return {
                code: "CONFLICT",
                userMessage: apiMessage ?? "This record already exists. Please use a unique email or phone.",
                isDuplicate: true,
            };
        }

        if (status === 400) {
            // Validation error — often has an array of messages
            const messages = data?.message;
            const userMessage = Array.isArray(messages)
                ? messages.join(". ")
                : (apiMessage ?? "Invalid data. Please check your inputs.");
            return {
                code: "VALIDATION_ERROR",
                userMessage,
                isValidation: true,
            };
        }

        if (status === 422) {
            return {
                code: "UNPROCESSABLE",
                userMessage: apiMessage ?? "The data provided could not be processed.",
                isValidation: true,
            };
        }

        if (status && status >= 500) {
            return {
                code: "SERVER_ERROR",
                userMessage: "A server error occurred. Please try again later.",
            };
        }

        if (!error.response) {
            return {
                code: "NETWORK_ERROR",
                userMessage: "Unable to reach the server. Please check your connection.",
            };
        }
    }

    return {
        code: "UNKNOWN_ERROR",
        userMessage: "An unexpected error occurred. Please try again.",
    };
}

// ─── Typed API helpers ────────────────────────────────────────────────────────
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
}

export async function post<T>(url: string, data?: unknown): Promise<T> {
    const response = await apiClient.post<T>(url, data);
    return response.data;
}

export async function patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await apiClient.patch<T>(url, data);
    return response.data;
}

export async function del<T>(url: string): Promise<T> {
    const response = await apiClient.delete<T>(url);
    return response.data;
}

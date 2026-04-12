import axios, { AxiosHeaders } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    apiClient,
    del,
    get,
    normalizeError,
    patch,
    post,
} from "@/lib/api-client";
import { ACCESS_TOKEN_KEY, CURRENT_USER_KEY } from "@/lib/constants";

const LEGACY_USER_KEY = "user";

function makeAxiosError(status?: number, data?: Record<string, unknown>) {
    return {
        isAxiosError: true,
        response: status
            ? {
                status,
                data,
            }
            : undefined,
    };
}

describe("api-client", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it("injects the bearer token into request headers", async () => {
        localStorage.setItem(ACCESS_TOKEN_KEY, "jwt-token");
        const handler = apiClient.interceptors.request.handlers[0]?.fulfilled;

        const config = await handler?.({
            headers: new AxiosHeaders(),
        });

        expect(config?.headers.Authorization).toBe("Bearer jwt-token");
    });

    it("normalizes interceptor response errors", async () => {
        const handler = apiClient.interceptors.response.handlers[0]?.rejected;

        await expect(handler?.(makeAxiosError(403))).rejects.toEqual({
            code: "FORBIDDEN",
            userMessage: "You don't have permission to perform this action.",
            isPermissionDenied: true,
        });
    });

    it("clears cached auth on 401 errors", () => {
        localStorage.setItem(ACCESS_TOKEN_KEY, "jwt-token");
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: "user-1" }));
        localStorage.setItem(LEGACY_USER_KEY, JSON.stringify({ id: "legacy-user" }));

        expect(normalizeError(makeAxiosError(401))).toEqual({
            code: "UNAUTHORIZED",
            userMessage: "Your session has expired. Please log in again.",
            isUnauthorized: true,
        });
        expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
        expect(localStorage.getItem(CURRENT_USER_KEY)).toBeNull();
        expect(localStorage.getItem(LEGACY_USER_KEY)).toBeNull();
    });

    it("maps validation errors from array messages", () => {
        expect(
            normalizeError(
                makeAxiosError(400, { message: ["Email is invalid", "Password is required"] }),
            ),
        ).toEqual({
            code: "VALIDATION_ERROR",
            userMessage: "Email is invalid. Password is required",
            isValidation: true,
        });
    });

    it("maps other known and fallback errors", () => {
        expect(normalizeError(makeAxiosError(404, { message: "Member not found" }))).toEqual({
            code: "NOT_FOUND",
            userMessage: "Member not found",
            isNotFound: true,
        });
        expect(normalizeError(makeAxiosError(409))).toEqual({
            code: "CONFLICT",
            userMessage: "This record already exists. Please use a unique email or phone.",
            isDuplicate: true,
        });
        expect(normalizeError(makeAxiosError(422))).toEqual({
            code: "UNPROCESSABLE",
            userMessage: "The data provided could not be processed.",
            isValidation: true,
        });
        expect(normalizeError(makeAxiosError(500))).toEqual({
            code: "SERVER_ERROR",
            userMessage: "A server error occurred. Please try again later.",
        });
        expect(normalizeError(makeAxiosError())).toEqual({
            code: "NETWORK_ERROR",
            userMessage: "Unable to reach the server. Please check your connection.",
        });
        expect(normalizeError(new Error("boom"))).toEqual({
            code: "UNKNOWN_ERROR",
            userMessage: "An unexpected error occurred. Please try again.",
        });
    });

    it("returns response data from helper methods", async () => {
        vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: { id: "get" } } as never);
        vi.spyOn(apiClient, "post").mockResolvedValueOnce({ data: { id: "post" } } as never);
        vi.spyOn(apiClient, "patch").mockResolvedValueOnce({ data: { id: "patch" } } as never);
        vi.spyOn(apiClient, "delete").mockResolvedValueOnce({ data: { id: "delete" } } as never);

        await expect(get("/members")).resolves.toEqual({ id: "get" });
        await expect(post("/members", { firstName: "A" })).resolves.toEqual({ id: "post" });
        await expect(patch("/members/1", { firstName: "B" })).resolves.toEqual({ id: "patch" });
        await expect(del("/members/1")).resolves.toEqual({ id: "delete" });
    });

    it("recognizes axios errors via axios.isAxiosError", () => {
        expect(axios.isAxiosError(makeAxiosError(403))).toBe(true);
    });
});

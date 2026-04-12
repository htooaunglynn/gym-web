import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/lib/api-client";
import { login, registerMember, getMe } from "@/services/auth";
import { buildAuthResponse, buildUser } from "@/mocks/factories";

vi.mock("@/lib/api-client", () => ({
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    del: vi.fn(),
}));

const mockGet = vi.mocked(apiClient.get);
const mockPost = vi.mocked(apiClient.post);

beforeEach(() => {
    vi.clearAllMocks();
});

describe("login", () => {
    it("calls POST /auth/login with payload", async () => {
        const authResponse = buildAuthResponse();
        mockPost.mockResolvedValueOnce(authResponse);
        const payload = { email: "admin@example.com", password: "Password1" };

        const result = await login(payload);

        expect(mockPost).toHaveBeenCalledWith("/auth/login", payload);
        expect(result).toBe(authResponse);
    });
});

describe("registerMember", () => {
    it("calls POST /auth/register/member with payload", async () => {
        const authResponse = buildAuthResponse();
        mockPost.mockResolvedValueOnce(authResponse);
        const payload = {
            email: "new@example.com",
            firstName: "New",
            lastName: "Member",
            password: "Password1",
        };

        const result = await registerMember(payload);

        expect(mockPost).toHaveBeenCalledWith("/auth/register/member", payload);
        expect(result).toBe(authResponse);
    });
});

describe("getMe", () => {
    it("calls GET /auth/me", async () => {
        const user = buildUser();
        mockGet.mockResolvedValueOnce(user);

        const result = await getMe();

        expect(mockGet).toHaveBeenCalledWith("/auth/me");
        expect(result).toBe(user);
    });
});

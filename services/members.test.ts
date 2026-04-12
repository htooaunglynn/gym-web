import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/lib/api-client";
import {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
} from "@/services/members";
import { buildMember, buildMemberList } from "@/mocks/factories";

vi.mock("@/lib/api-client", () => ({
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    del: vi.fn(),
}));

const mockGet = vi.mocked(apiClient.get);
const mockPost = vi.mocked(apiClient.post);
const mockPatch = vi.mocked(apiClient.patch);
const mockDel = vi.mocked(apiClient.del);

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getMembers", () => {
    it("calls GET /members with no params", async () => {
        const list = buildMemberList();
        mockGet.mockResolvedValueOnce(list);

        const result = await getMembers();

        expect(mockGet).toHaveBeenCalledWith("/members", undefined);
        expect(result).toBe(list);
    });

    it("calls GET /members with params", async () => {
        const list = buildMemberList();
        mockGet.mockResolvedValueOnce(list);
        const params = { page: 2, limit: 5, search: "alice" };

        await getMembers(params);

        expect(mockGet).toHaveBeenCalledWith("/members", params);
    });
});

describe("getMemberById", () => {
    it("calls GET /members/:id", async () => {
        const member = buildMember({ id: "m-1" });
        mockGet.mockResolvedValueOnce(member);

        const result = await getMemberById("m-1");

        expect(mockGet).toHaveBeenCalledWith("/members/m-1");
        expect(result).toBe(member);
    });
});

describe("createMember", () => {
    it("calls POST /members with payload", async () => {
        const member = buildMember({ id: "m-new" });
        mockPost.mockResolvedValueOnce(member);
        const payload = {
            email: "new@example.com",
            firstName: "New",
            lastName: "User",
            password: "Password1",
        };

        const result = await createMember(payload);

        expect(mockPost).toHaveBeenCalledWith("/members", payload);
        expect(result).toBe(member);
    });
});

describe("updateMember", () => {
    it("calls PATCH /members/:id with payload", async () => {
        const member = buildMember({ id: "m-1", firstName: "Updated" });
        mockPatch.mockResolvedValueOnce(member);
        const payload = { firstName: "Updated" };

        const result = await updateMember("m-1", payload);

        expect(mockPatch).toHaveBeenCalledWith("/members/m-1", payload);
        expect(result).toBe(member);
    });
});

describe("deleteMember", () => {
    it("calls DELETE /members/:id", async () => {
        mockDel.mockResolvedValueOnce(undefined);

        await deleteMember("m-1");

        expect(mockDel).toHaveBeenCalledWith("/members/m-1");
    });
});

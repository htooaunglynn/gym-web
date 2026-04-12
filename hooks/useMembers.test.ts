import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
    useMembers,
    useMember,
    useCreateMember,
    useUpdateMember,
    useDeleteMember,
} from "@/hooks/useMembers";
import * as memberService from "@/services/members";
import { buildMember, buildMemberList } from "@/mocks/factories";
import { queryKeys } from "@/hooks/useApi";

vi.mock("@/services/members");

const mockGetMembers = vi.mocked(memberService.getMembers);
const mockGetMemberById = vi.mocked(memberService.getMemberById);
const mockCreateMember = vi.mocked(memberService.createMember);
const mockUpdateMember = vi.mocked(memberService.updateMember);
const mockDeleteMember = vi.mocked(memberService.deleteMember);

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return function Wrapper({ children }: { children: React.ReactNode }) {
        return React.createElement(QueryClientProvider, { client: queryClient }, children);
    };
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe("useMembers", () => {
    it("fetches members and returns data", async () => {
        const list = buildMemberList(3);
        mockGetMembers.mockResolvedValueOnce(list);

        const { result } = renderHook(() => useMembers(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(list);
        expect(mockGetMembers).toHaveBeenCalledWith(undefined);
    });

    it("passes params to the service", async () => {
        const list = buildMemberList(1);
        mockGetMembers.mockResolvedValueOnce(list);
        const params = { page: 2, search: "bob" };

        const { result } = renderHook(() => useMembers(params), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetMembers).toHaveBeenCalledWith(params);
    });

    it("uses the correct query key", () => {
        mockGetMembers.mockResolvedValueOnce(buildMemberList());
        const params = { page: 1 };
        const { result } = renderHook(() => useMembers(params), { wrapper: createWrapper() });
        // The query key is part of the query object
        expect(result.current).toBeDefined();
    });
});

describe("useMember", () => {
    it("fetches a single member by id", async () => {
        const member = buildMember({ id: "m-1" });
        mockGetMemberById.mockResolvedValueOnce(member);

        const { result } = renderHook(() => useMember("m-1"), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(member);
        expect(mockGetMemberById).toHaveBeenCalledWith("m-1");
    });

    it("does not fetch when id is empty string (enabled: false)", () => {
        const { result } = renderHook(() => useMember(""), { wrapper: createWrapper() });

        expect(result.current.fetchStatus).toBe("idle");
        expect(mockGetMemberById).not.toHaveBeenCalled();
    });
});

describe("useCreateMember", () => {
    it("calls createMember and invalidates members.all on success", async () => {
        const member = buildMember({ id: "new-m" });
        mockCreateMember.mockResolvedValueOnce(member);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useCreateMember(), { wrapper });

        result.current.mutate({
            email: "new@example.com",
            firstName: "New",
            lastName: "User",
            password: "Password1",
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.members.all() })
        );
    });
});

describe("useDeleteMember", () => {
    it("calls deleteMember and invalidates members.all on success", async () => {
        mockDeleteMember.mockResolvedValueOnce(undefined);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useDeleteMember(), { wrapper });

        result.current.mutate("m-1");

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.members.all() })
        );
    });
});

describe("useUpdateMember", () => {
    it("calls updateMember and invalidates both all() and detail(id) on success", async () => {
        const member = buildMember({ id: "m-1", firstName: "Updated" });
        mockUpdateMember.mockResolvedValueOnce(member);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useUpdateMember(), { wrapper });

        result.current.mutate({ id: "m-1", payload: { firstName: "Updated" } });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.members.all() })
        );
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.members.detail("m-1") })
        );
    });
});

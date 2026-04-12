import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
    useTrainers,
    useTrainer,
    useCreateTrainer,
    useUpdateTrainer,
    useDeleteTrainer,
    useTrainersDropdown,
} from "@/hooks/useTrainers";
import * as trainerService from "@/services/trainers";
import { buildTrainer, buildTrainerList } from "@/mocks/factories";
import { queryKeys } from "@/hooks/useApi";

vi.mock("@/services/trainers");

const mockGetTrainers = vi.mocked(trainerService.getTrainers);
const mockGetTrainerById = vi.mocked(trainerService.getTrainerById);
const mockCreateTrainer = vi.mocked(trainerService.createTrainer);
const mockUpdateTrainer = vi.mocked(trainerService.updateTrainer);
const mockDeleteTrainer = vi.mocked(trainerService.deleteTrainer);

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

describe("useTrainers", () => {
    it("fetches trainers and returns data", async () => {
        const list = buildTrainerList(3);
        mockGetTrainers.mockResolvedValueOnce(list);

        const { result } = renderHook(() => useTrainers(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(list);
        expect(mockGetTrainers).toHaveBeenCalledWith(undefined);
    });

    it("passes params to the service", async () => {
        const list = buildTrainerList(1);
        mockGetTrainers.mockResolvedValueOnce(list);
        const params = { page: 2, search: "tay" };

        const { result } = renderHook(() => useTrainers(params), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetTrainers).toHaveBeenCalledWith(params);
    });
});

describe("useTrainersDropdown", () => {
    it("maps trainers to dropdown options", async () => {
        mockGetTrainers.mockResolvedValueOnce(
            buildTrainerList(2, { firstName: "Taylor", lastName: "Coach" })
        );

        const { result } = renderHook(() => useTrainersDropdown(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([
            { id: "trainer-1", label: "Taylor Coach" },
            { id: "trainer-2", label: "Taylor Coach" },
        ]);
        expect(mockGetTrainers).toHaveBeenCalledWith({ limit: 200 });
    });
});

describe("useTrainer", () => {
    it("fetches a single trainer by id", async () => {
        const trainer = buildTrainer({ id: "t-1" });
        mockGetTrainerById.mockResolvedValueOnce(trainer);

        const { result } = renderHook(() => useTrainer("t-1"), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(trainer);
        expect(mockGetTrainerById).toHaveBeenCalledWith("t-1");
    });
});

describe("useCreateTrainer", () => {
    it("calls createTrainer and invalidates trainers.all on success", async () => {
        const trainer = buildTrainer({ id: "new-t" });
        mockCreateTrainer.mockResolvedValueOnce(trainer);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useCreateTrainer(), { wrapper });

        result.current.mutate({
            email: "trainer@example.com",
            firstName: "Taylor",
            lastName: "Coach",
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.trainers.all() })
        );
    });
});

describe("useUpdateTrainer", () => {
    it("invalidates all and detail on successful update", async () => {
        const trainer = buildTrainer({ id: "t-1", firstName: "Updated" });
        mockUpdateTrainer.mockResolvedValueOnce(trainer);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useUpdateTrainer(), { wrapper });

        result.current.mutate({ id: "t-1", payload: { firstName: "Updated" } });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.trainers.all() })
        );
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.trainers.detail("t-1") })
        );
    });
});

describe("useDeleteTrainer", () => {
    it("invalidates trainers.all on successful delete", async () => {
        mockDeleteTrainer.mockResolvedValueOnce(undefined);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useDeleteTrainer(), { wrapper });

        result.current.mutate("t-1");

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.trainers.all() })
        );
    });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
    useEquipment,
    useEquipmentItem,
    useCreateEquipment,
    useUpdateEquipment,
    useDeleteEquipment,
} from "@/hooks/useEquipment";
import * as equipmentService from "@/services/equipment";
import { buildEquipment, buildEquipmentList } from "@/mocks/factories";
import { queryKeys } from "@/hooks/useApi";

vi.mock("@/services/equipment");

const mockGetEquipment = vi.mocked(equipmentService.getEquipment);
const mockGetEquipmentById = vi.mocked(equipmentService.getEquipmentById);
const mockCreateEquipment = vi.mocked(equipmentService.createEquipment);
const mockUpdateEquipment = vi.mocked(equipmentService.updateEquipment);
const mockDeleteEquipment = vi.mocked(equipmentService.deleteEquipment);

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

describe("useEquipment", () => {
    it("fetches equipment and returns data", async () => {
        const list = buildEquipmentList(3);
        mockGetEquipment.mockResolvedValueOnce(list);

        const { result } = renderHook(() => useEquipment(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(list);
        expect(mockGetEquipment).toHaveBeenCalledWith(undefined);
    });

    it("passes params to the service", async () => {
        const list = buildEquipmentList(1);
        mockGetEquipment.mockResolvedValueOnce(list);
        const params = { page: 2, status: "OPERATIONAL" };

        const { result } = renderHook(() => useEquipment(params), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockGetEquipment).toHaveBeenCalledWith(params);
    });
});

describe("useEquipmentItem", () => {
    it("fetches a single equipment item by id", async () => {
        const equipment = buildEquipment({ id: "eq-1" });
        mockGetEquipmentById.mockResolvedValueOnce(equipment);

        const { result } = renderHook(() => useEquipmentItem("eq-1"), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(equipment);
        expect(mockGetEquipmentById).toHaveBeenCalledWith("eq-1");
    });
});

describe("useCreateEquipment", () => {
    it("invalidates equipment.all on successful create", async () => {
        const equipment = buildEquipment({ id: "eq-new" });
        mockCreateEquipment.mockResolvedValueOnce(equipment);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useCreateEquipment(), { wrapper });

        result.current.mutate({
            name: "Row Machine",
            category: "Strength",
            quantity: 2,
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.equipment.all() })
        );
    });
});

describe("useUpdateEquipment", () => {
    it("invalidates all and detail on successful update", async () => {
        const equipment = buildEquipment({ id: "eq-1", name: "Updated Rack" });
        mockUpdateEquipment.mockResolvedValueOnce(equipment);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useUpdateEquipment(), { wrapper });

        result.current.mutate({ id: "eq-1", payload: { name: "Updated Rack" } });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.equipment.all() })
        );
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.equipment.detail("eq-1") })
        );
    });
});

describe("useDeleteEquipment", () => {
    it("invalidates equipment.all on successful delete", async () => {
        mockDeleteEquipment.mockResolvedValueOnce(undefined);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useDeleteEquipment(), { wrapper });

        result.current.mutate("eq-1");

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: queryKeys.equipment.all() })
        );
    });
});

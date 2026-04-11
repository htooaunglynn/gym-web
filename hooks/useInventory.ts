"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useApi";
import * as inventoryService from "@/services/inventory";
import { ListInventoryParams } from "@/services/inventory";
import {
    InventoryMovement,
    CreateIncomingMovementPayload,
    CreateOutgoingMovementPayload,
    CreateAdjustmentMovementPayload,
} from "@/types/entities";
import { AppError, PaginatedResponse } from "@/types/api";

export function useInventoryMovements(params?: ListInventoryParams) {
    return useQuery<PaginatedResponse<InventoryMovement>, AppError>({
        queryKey: queryKeys.inventory.list(params as Record<string, unknown>),
        queryFn: () => inventoryService.getInventoryMovements(params),
    });
}

export function useInventoryMovement(id: string) {
    return useQuery<InventoryMovement, AppError>({
        queryKey: queryKeys.inventory.detail(id),
        queryFn: () => inventoryService.getInventoryMovementById(id),
        enabled: !!id,
    });
}

export function useCreateIncoming() {
    const queryClient = useQueryClient();
    return useMutation<InventoryMovement, AppError, CreateIncomingMovementPayload>({
        mutationFn: inventoryService.createIncoming,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
        },
    });
}

export function useCreateOutgoing() {
    const queryClient = useQueryClient();
    return useMutation<InventoryMovement, AppError, CreateOutgoingMovementPayload>({
        mutationFn: inventoryService.createOutgoing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
        },
    });
}

export function useCreateAdjustment() {
    const queryClient = useQueryClient();
    return useMutation<InventoryMovement, AppError, CreateAdjustmentMovementPayload>({
        mutationFn: inventoryService.createAdjustment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
        },
    });
}

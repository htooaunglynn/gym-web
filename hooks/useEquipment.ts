"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useApi";
import * as equipmentService from "@/services/equipment";
import { ListEquipmentParams } from "@/services/equipment";
import { CreateEquipmentPayload, UpdateEquipmentPayload, Equipment } from "@/types/entities";
import { AppError } from "@/types/api";

export function useEquipment(params?: ListEquipmentParams) {
    return useQuery({
        queryKey: queryKeys.equipment.list(params as Record<string, unknown>),
        queryFn: () => equipmentService.getEquipment(params),
    });
}

export function useEquipmentItem(id: string) {
    return useQuery({
        queryKey: queryKeys.equipment.detail(id),
        queryFn: () => equipmentService.getEquipmentById(id),
        enabled: !!id,
    });
}

export function useCreateEquipment() {
    const queryClient = useQueryClient();
    return useMutation<Equipment, AppError, CreateEquipmentPayload>({
        mutationFn: equipmentService.createEquipment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
        },
    });
}

export function useUpdateEquipment() {
    const queryClient = useQueryClient();
    return useMutation<Equipment, AppError, { id: string; payload: UpdateEquipmentPayload }>({
        mutationFn: ({ id, payload }) => equipmentService.updateEquipment(id, payload),
        onSuccess: (_data, vars) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.equipment.detail(vars.id) });
        },
    });
}

export function useDeleteEquipment() {
    const queryClient = useQueryClient();
    return useMutation<void, AppError, string>({
        mutationFn: equipmentService.deleteEquipment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all() });
        },
    });
}

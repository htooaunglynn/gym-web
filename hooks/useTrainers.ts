"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useApi";
import * as trainerService from "@/services/trainers";
import { ListTrainersParams } from "@/services/trainers";
import { CreateTrainerPayload, UpdateTrainerPayload, Trainer } from "@/types/entities";
import { AppError, PaginatedResponse } from "@/types/api";

export function useTrainers(params?: ListTrainersParams) {
    return useQuery<PaginatedResponse<Trainer>, AppError>({
        queryKey: queryKeys.trainers.list(params as Record<string, unknown>),
        queryFn: () => trainerService.getTrainers(params),
    });
}

/** Lightweight hook that fetches all trainers for dropdown population. */
export function useTrainersDropdown() {
    return useQuery({
        queryKey: queryKeys.trainers.dropdown(),
        queryFn: () => trainerService.getTrainers({ limit: 200 }),
        select: (data): { id: string; label: string }[] =>
            data.data.map((t: Trainer) => ({
                id: t.id,
                label: `${t.firstName} ${t.lastName}`,
            })),
        staleTime: 1000 * 60 * 10, // dropdown data can be stale for 10 min
    });
}

export function useTrainer(id: string) {
    return useQuery<Trainer, AppError>({
        queryKey: queryKeys.trainers.detail(id),
        queryFn: () => trainerService.getTrainerById(id),
        enabled: !!id,
    });
}

export function useCreateTrainer() {
    const queryClient = useQueryClient();
    return useMutation<Trainer, AppError, CreateTrainerPayload>({
        mutationFn: trainerService.createTrainer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all() });
        },
    });
}

export function useUpdateTrainer() {
    const queryClient = useQueryClient();
    return useMutation<Trainer, AppError, { id: string; payload: UpdateTrainerPayload }>({
        mutationFn: ({ id, payload }) => trainerService.updateTrainer(id, payload),
        onSuccess: (_data, vars) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.trainers.detail(vars.id) });
        },
    });
}

export function useDeleteTrainer() {
    const queryClient = useQueryClient();
    return useMutation<void, AppError, string>({
        mutationFn: trainerService.deleteTrainer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all() });
        },
    });
}

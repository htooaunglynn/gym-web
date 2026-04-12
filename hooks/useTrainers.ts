"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useApi";
import { createCrudHooks } from "@/hooks/useCrudEntity";
import * as trainerService from "@/services/trainers";
import { ListTrainersParams } from "@/services/trainers";
import { CreateTrainerPayload, UpdateTrainerPayload, Trainer } from "@/types/entities";

const trainerCrudHooks = createCrudHooks<Trainer, CreateTrainerPayload, UpdateTrainerPayload, ListTrainersParams>({
    queryKeys: queryKeys.trainers,
    service: {
        list: trainerService.getTrainers,
        detail: trainerService.getTrainerById,
        create: trainerService.createTrainer,
        update: trainerService.updateTrainer,
        remove: trainerService.deleteTrainer,
    },
});

export const useTrainers = trainerCrudHooks.useList;

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

export const useTrainer = trainerCrudHooks.useDetail;
export const useCreateTrainer = trainerCrudHooks.useCreate;
export const useUpdateTrainer = trainerCrudHooks.useUpdate;
export const useDeleteTrainer = trainerCrudHooks.useDelete;

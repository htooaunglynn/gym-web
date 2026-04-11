import { get, post, patch, del } from "@/lib/api-client";
import {
    Trainer,
    CreateTrainerPayload,
    UpdateTrainerPayload,
} from "@/types/entities";
import { PaginatedResponse } from "@/types/api";

export interface ListTrainersParams {
    page?: number;
    limit?: number;
    search?: string;
}

export async function getTrainers(params?: ListTrainersParams): Promise<PaginatedResponse<Trainer>> {
    return get<PaginatedResponse<Trainer>>("/trainers", params as Record<string, unknown>);
}

export async function getTrainerById(id: string): Promise<Trainer> {
    return get<Trainer>(`/trainers/${id}`);
}

export async function createTrainer(payload: CreateTrainerPayload): Promise<Trainer> {
    return post<Trainer>("/trainers", payload);
}

export async function updateTrainer(id: string, payload: UpdateTrainerPayload): Promise<Trainer> {
    return patch<Trainer>(`/trainers/${id}`, payload);
}

export async function deleteTrainer(id: string): Promise<void> {
    return del<void>(`/trainers/${id}`);
}

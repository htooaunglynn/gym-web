import { apiClient, PaginationResponse } from "@/lib/apiClient";
import { Trainer, CreateTrainerInput, UpdateTrainerInput } from "@/types/trainer";

export const TrainerService = {
    async getAll(params: { page?: number; limit?: number; includeDeleted?: boolean; sortBy?: string; sortOrder?: "asc" | "desc" } = {}) {
        return apiClient<PaginationResponse<Trainer>>("/trainers", { params });
    },

    async getById(id: string) {
        return apiClient<Trainer>(`/trainers/${id}`);
    },

    async create(data: CreateTrainerInput) {
        return apiClient<Trainer>("/trainers", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: UpdateTrainerInput) {
        return apiClient<Trainer>(`/trainers/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string) {
        return apiClient<void>(`/trainers/${id}`, {
            method: "DELETE",
        });
    },
};

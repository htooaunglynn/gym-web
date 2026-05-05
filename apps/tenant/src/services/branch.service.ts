import { apiClient, PaginationResponse } from "@/lib/apiClient";
import { Branch, CreateBranchInput, UpdateBranchInput } from "@/types/branch";

export const BranchService = {
    async getAll(params: { page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" } = {}) {
        return apiClient<PaginationResponse<Branch>>("/branches", { params });
    },

    async getById(id: string) {
        return apiClient<Branch>(`/branches/${id}`);
    },

    async create(data: CreateBranchInput) {
        return apiClient<Branch>("/branches", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: UpdateBranchInput) {
        return apiClient<Branch>(`/branches/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string) {
        return apiClient<void>(`/branches/${id}`, {
            method: "DELETE",
        });
    },
};

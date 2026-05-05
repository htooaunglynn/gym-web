import { apiClient, PaginationResponse } from "@/lib/apiClient";
import { Member, CreateMemberInput, UpdateMemberInput } from "@/types/member";

export const MemberService = {
    async getAll(params: { page?: number; limit?: number; includeDeleted?: boolean; sortBy?: string; sortOrder?: "asc" | "desc" } = {}) {
        return apiClient<PaginationResponse<Member>>("/members", { params });
    },

    async getById(id: string) {
        return apiClient<Member>(`/members/${id}`);
    },

    async create(data: CreateMemberInput) {
        return apiClient<Member>("/members", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: UpdateMemberInput) {
        return apiClient<Member>(`/members/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string) {
        return apiClient<void>(`/members/${id}`, {
            method: "DELETE",
        });
    },

    async assignTrainer(memberId: string, trainerId: string | null) {
        return this.update(memberId, { trainerId });
    },
};

import { apiClient } from './api'
import type {
    CreateMemberDTO,
    UpdateMemberDTO,
    MemberResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'

export const memberService = {
    async list(params: PaginationParams = { page: 1, limit: 10 }): Promise<PaginatedResponse<MemberResponse>> {
        return apiClient.get('/members', { params })
    },

    async getById(id: string): Promise<MemberResponse> {
        return apiClient.get(`/members/${id}`)
    },

    async create(dto: CreateMemberDTO): Promise<MemberResponse> {
        return apiClient.post('/members', dto)
    },

    async update(id: string, dto: UpdateMemberDTO): Promise<MemberResponse> {
        return apiClient.patch(`/members/${id}`, dto)
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/members/${id}`)
    },
}

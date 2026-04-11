import { apiClient } from './api'
import type {
    CreateMemberDTO,
    UpdateMemberDTO,
    MemberResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'
import { PAGINATION_LIMITS } from '@/config/pagination'
import { normalizeListResponse } from '@/services/utils/normalization'

export const memberService = {
    async list(params: PaginationParams = { page: 1, limit: PAGINATION_LIMITS.defaultList }): Promise<PaginatedResponse<MemberResponse>> {
        const page = params.page ?? 1
        const limit = Math.min(params.limit ?? PAGINATION_LIMITS.defaultList, PAGINATION_LIMITS.members)
        const includeDeleted = params.includeDeleted

        const response = await apiClient.get<PaginatedResponse<MemberResponse> | MemberResponse[]>('/members', {
            params: {
                page,
                limit,
                ...(typeof includeDeleted === 'boolean' ? { includeDeleted } : {}),
            },
        })

        return normalizeListResponse(response, page, limit)
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

import { apiClient } from './api'
import type {
    CreateMemberDTO,
    UpdateMemberDTO,
    MemberResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'

const MAX_LIST_LIMIT = 50

function normalizeMemberListResponse(
    response: PaginatedResponse<MemberResponse> | MemberResponse[],
    page: number,
    limit: number
): PaginatedResponse<MemberResponse> {
    if (Array.isArray(response)) {
        return {
            data: response,
            total: response.length,
            page,
            limit,
            totalPages: response.length === 0 ? 0 : 1,
        }
    }

    return response
}

export const memberService = {
    async list(params: PaginationParams = { page: 1, limit: 10 }): Promise<PaginatedResponse<MemberResponse>> {
        const page = params.page ?? 1
        const limit = Math.min(params.limit ?? 10, MAX_LIST_LIMIT)
        const includeDeleted = params.includeDeleted

        const response = await apiClient.get<PaginatedResponse<MemberResponse> | MemberResponse[]>('/members', {
            params: {
                page,
                limit,
                ...(typeof includeDeleted === 'boolean' ? { includeDeleted } : {}),
            },
        })

        return normalizeMemberListResponse(response, page, limit)
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

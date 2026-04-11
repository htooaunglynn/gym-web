import { apiClient } from './api'
import type {
    CreateTrainerDTO,
    UpdateTrainerDTO,
    TrainerResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'
import { PAGINATION_LIMITS } from '@/config/pagination'
import { normalizeListResponse } from '@/services/utils/normalization'

export const trainerService = {
    async list(
        params: PaginationParams & { includeMembers?: boolean } = {
            page: 1,
            limit: PAGINATION_LIMITS.defaultList,
            includeMembers: false,
        }
    ): Promise<PaginatedResponse<TrainerResponse>> {
        const page = params.page ?? 1
        const limit = Math.min(params.limit ?? PAGINATION_LIMITS.defaultList, PAGINATION_LIMITS.trainers)
        const includeDeleted = params.includeDeleted
        const includeMembers = params.includeMembers

        const response = await apiClient.get<PaginatedResponse<TrainerResponse> | TrainerResponse[]>('/trainers', {
            params: {
                page,
                limit,
                ...(typeof includeDeleted === 'boolean' ? { includeDeleted } : {}),
                ...(typeof includeMembers === 'boolean' ? { includeMembers } : {}),
            },
        })

        return normalizeListResponse(response, page, limit)
    },

    async getById(id: string, includeMembers: boolean = false): Promise<TrainerResponse> {
        return apiClient.get(`/trainers/${id}`, {
            params: includeMembers ? { includeMembers: true } : undefined,
        })
    },

    async create(dto: CreateTrainerDTO): Promise<TrainerResponse> {
        return apiClient.post('/trainers', dto)
    },

    async update(id: string, dto: UpdateTrainerDTO): Promise<TrainerResponse> {
        return apiClient.patch(`/trainers/${id}`, dto)
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/trainers/${id}`)
    },
}

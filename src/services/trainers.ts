import { apiClient } from './api'
import type {
    CreateTrainerDTO,
    UpdateTrainerDTO,
    TrainerResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'

const MAX_LIST_LIMIT = 50

function normalizeTrainerListResponse(
    response: PaginatedResponse<TrainerResponse> | TrainerResponse[],
    page: number,
    limit: number
): PaginatedResponse<TrainerResponse> {
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

export const trainerService = {
    async list(
        params: PaginationParams & { includeMembers?: boolean } = {
            page: 1,
            limit: 10,
            includeMembers: false,
        }
    ): Promise<PaginatedResponse<TrainerResponse>> {
        const page = params.page ?? 1
        const limit = Math.min(params.limit ?? 10, MAX_LIST_LIMIT)
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

        return normalizeTrainerListResponse(response, page, limit)
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

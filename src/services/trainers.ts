import { apiClient } from './api'
import type {
    CreateTrainerDTO,
    UpdateTrainerDTO,
    TrainerResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'

export const trainerService = {
    async list(
        params: PaginationParams & { includeMembers?: boolean } = {
            page: 1,
            limit: 10,
            includeMembers: false,
        }
    ): Promise<PaginatedResponse<TrainerResponse>> {
        return apiClient.get('/trainers', { params })
    },

    async getById(id: string, includeMembers: boolean = false): Promise<TrainerResponse> {
        return apiClient.get(`/trainers/${id}`, { params: { includeMembers } })
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

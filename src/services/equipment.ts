import { apiClient } from './api'
import type {
    CreateEquipmentDTO,
    UpdateEquipmentDTO,
    EquipmentResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'
import { PAGINATION_LIMITS } from '@/config/pagination'

export const equipmentService = {
    async list(params: PaginationParams = { page: 1, limit: PAGINATION_LIMITS.defaultList }): Promise<PaginatedResponse<EquipmentResponse>> {
        const page = params.page ?? 1
        const limit = Math.min(params.limit ?? PAGINATION_LIMITS.defaultList, PAGINATION_LIMITS.equipment)
        const includeDeleted = params.includeDeleted

        return apiClient.get('/equipment', {
            params: {
                page,
                limit,
                ...(typeof includeDeleted === 'boolean' ? { includeDeleted } : {}),
            },
        })
    },

    async getById(id: string): Promise<EquipmentResponse> {
        return apiClient.get(`/equipment/${id}`)
    },

    async create(dto: CreateEquipmentDTO): Promise<EquipmentResponse> {
        return apiClient.post('/equipment', dto)
    },

    async update(id: string, dto: UpdateEquipmentDTO): Promise<EquipmentResponse> {
        return apiClient.patch(`/equipment/${id}`, dto)
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/equipment/${id}`)
    },
}

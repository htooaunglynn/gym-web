import { apiClient } from './api'
import type {
    CreateEquipmentDTO,
    UpdateEquipmentDTO,
    EquipmentResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'

export const equipmentService = {
    async list(params: PaginationParams = { page: 1, limit: 10 }): Promise<PaginatedResponse<EquipmentResponse>> {
        return apiClient.get('/equipment', { params })
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

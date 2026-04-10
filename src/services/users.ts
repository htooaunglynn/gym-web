import { apiClient } from './api'
import type {
    CreateUserDTO,
    UpdateUserDTO,
    UserResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'

export const userService = {
    async list(params: PaginationParams = { page: 1, limit: 10 }): Promise<PaginatedResponse<UserResponse>> {
        return apiClient.get('/users', { params })
    },

    async getById(id: string): Promise<UserResponse> {
        return apiClient.get(`/users/${id}`)
    },

    async create(dto: CreateUserDTO): Promise<UserResponse> {
        return apiClient.post('/users', dto)
    },

    async update(id: string, dto: UpdateUserDTO): Promise<UserResponse> {
        return apiClient.patch(`/users/${id}`, dto)
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/users/${id}`)
    },
}

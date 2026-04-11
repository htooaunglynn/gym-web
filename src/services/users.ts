import { apiClient } from './api'
import type {
    CreateUserDTO,
    UpdateUserDTO,
    UserResponse,
    PaginatedResponse,
    PaginationParams,
} from '@/types/api'
import { PAGINATION_LIMITS } from '@/config/pagination'

export const userService = {
    async list(params: PaginationParams = { page: 1, limit: PAGINATION_LIMITS.defaultList }): Promise<PaginatedResponse<UserResponse>> {
        const page = params.page ?? 1
        const limit = Math.min(params.limit ?? PAGINATION_LIMITS.defaultList, PAGINATION_LIMITS.users)
        const includeDeleted = params.includeDeleted

        return apiClient.get('/users', {
            params: {
                page,
                limit,
                ...(typeof includeDeleted === 'boolean' ? { includeDeleted } : {}),
            },
        })
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

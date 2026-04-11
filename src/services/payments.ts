import { apiClient } from './api'
import type { PaginatedResponse, PaymentFilterParams, PaymentResponse } from '@/types/api'
import { PAGINATION_LIMITS } from '@/config/pagination'

export const paymentService = {
    async list(params: PaymentFilterParams = { page: 1, limit: PAGINATION_LIMITS.defaultList }): Promise<PaginatedResponse<PaymentResponse>> {
        const page = params.page ?? 1
        const limit = Math.min(params.limit ?? PAGINATION_LIMITS.defaultList, PAGINATION_LIMITS.payments)

        return apiClient.get('/payments', {
            params: {
                ...params,
                page,
                limit,
            },
        })
    },

    async getById(id: string): Promise<PaymentResponse> {
        return apiClient.get(`/payments/${id}`)
    },
}

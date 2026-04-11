import { apiClient } from './api'
import type { PaginatedResponse, PaymentFilterParams, PaymentResponse } from '@/types/api'

export const paymentService = {
    async list(params: PaymentFilterParams = { page: 1, limit: 10 }): Promise<PaginatedResponse<PaymentResponse>> {
        return apiClient.get('/payments', { params })
    },

    async getById(id: string): Promise<PaymentResponse> {
        return apiClient.get(`/payments/${id}`)
    },
}

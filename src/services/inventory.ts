import { apiClient } from './api'
import type {
    RecordIncomingDTO,
    RecordOutgoingDTO,
    RecordAdjustmentDTO,
    MovementFilterParams,
    InventoryMovementResponse,
    PaginatedResponse,
} from '@/types/api'
import { PAGINATION_LIMITS } from '@/config/pagination'

export const inventoryService = {
    async list(params: MovementFilterParams = { page: 1, limit: PAGINATION_LIMITS.defaultList }): Promise<PaginatedResponse<InventoryMovementResponse>> {
        const page = params.page ?? 1
        const limit = Math.min(params.limit ?? PAGINATION_LIMITS.defaultList, PAGINATION_LIMITS.inventoryMovements)

        return apiClient.get('/inventory-movements', {
            params: {
                ...params,
                page,
                limit,
            },
        })
    },

    async getById(id: string): Promise<InventoryMovementResponse> {
        return apiClient.get(`/inventory-movements/${id}`)
    },

    async recordIncoming(dto: RecordIncomingDTO): Promise<InventoryMovementResponse> {
        return apiClient.post('/inventory-movements/incoming', dto)
    },

    async recordOutgoing(dto: RecordOutgoingDTO): Promise<InventoryMovementResponse> {
        return apiClient.post('/inventory-movements/outgoing', dto)
    },

    async recordAdjustment(dto: RecordAdjustmentDTO): Promise<InventoryMovementResponse> {
        return apiClient.post('/inventory-movements/adjustments', dto)
    },
}

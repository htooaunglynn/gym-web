import type { PaginatedResponse } from '@/types/api'

export function normalizeListResponse<T>(
    response: PaginatedResponse<T> | T[],
    page: number,
    limit: number
): PaginatedResponse<T> {
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

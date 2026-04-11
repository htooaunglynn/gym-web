import { apiClient } from './api'
import type {
    CheckInDTO,
    CheckOutDTO,
    AttendanceCorrectionDTO,
    AttendanceFilterParams,
    AttendanceResponse,
    PaginatedResponse,
} from '@/types/api'
import { PAGINATION_LIMITS } from '@/config/pagination'
import { normalizeListResponse } from '@/services/utils/normalization'

export const attendanceService = {
    async list(params: AttendanceFilterParams = { page: 1, limit: PAGINATION_LIMITS.defaultList }): Promise<PaginatedResponse<AttendanceResponse>> {
        const {
            page: rawPage = 1,
            limit: rawLimit = PAGINATION_LIMITS.defaultList,
            includeDeleted,
            memberId,
            eventType,
            subjectType,
            isCorrection,
            dateFrom,
            dateTo,
        } = params

        const page = rawPage
        const limit = Math.min(rawLimit, PAGINATION_LIMITS.attendance)

        const response = await apiClient.get<PaginatedResponse<AttendanceResponse> | AttendanceResponse[]>('/attendance', {
            params: {
                page,
                limit,
                ...(typeof includeDeleted === 'boolean' ? { includeDeleted } : {}),
                ...(memberId ? { memberId } : {}),
                ...(eventType ? { eventType } : {}),
                ...(subjectType ? { subjectType } : {}),
                ...(typeof isCorrection === 'boolean' ? { isCorrection } : {}),
                ...(dateFrom ? { dateFrom } : {}),
                ...(dateTo ? { dateTo } : {}),
            },
        })

        return normalizeListResponse(response, page, limit)
    },

    async getById(id: string): Promise<AttendanceResponse> {
        return apiClient.get(`/attendance/${id}`)
    },

    async checkIn(dto: CheckInDTO): Promise<AttendanceResponse> {
        return apiClient.post('/attendance/check-ins', dto)
    },

    async checkOut(dto: CheckOutDTO): Promise<AttendanceResponse> {
        return apiClient.post('/attendance/check-outs', dto)
    },

    async recordCorrection(dto: AttendanceCorrectionDTO): Promise<AttendanceResponse> {
        return apiClient.post('/attendance/corrections', dto)
    },
}

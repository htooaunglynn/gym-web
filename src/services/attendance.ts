import { apiClient } from './api'
import type {
    CheckInDTO,
    CheckOutDTO,
    AttendanceCorrectionDTO,
    AttendanceFilterParams,
    AttendanceResponse,
    PaginatedResponse,
} from '@/types/api'

const MAX_LIST_LIMIT = 50

function normalizeAttendanceListResponse(
    response: PaginatedResponse<AttendanceResponse> | AttendanceResponse[],
    page: number,
    limit: number
): PaginatedResponse<AttendanceResponse> {
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

export const attendanceService = {
    async list(params: AttendanceFilterParams = { page: 1, limit: 10 }): Promise<PaginatedResponse<AttendanceResponse>> {
        const {
            page: rawPage = 1,
            limit: rawLimit = 10,
            includeDeleted,
            memberId,
            eventType,
            subjectType,
            isCorrection,
            dateFrom,
            dateTo,
        } = params

        const page = rawPage
        const limit = Math.min(rawLimit, MAX_LIST_LIMIT)

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

        return normalizeAttendanceListResponse(response, page, limit)
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

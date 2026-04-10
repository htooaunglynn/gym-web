import { apiClient } from './api'
import type {
    CheckInDTO,
    CheckOutDTO,
    AttendanceCorrectionDTO,
    AttendanceFilterParams,
    AttendanceResponse,
    PaginatedResponse,
} from '@/types/api'

export const attendanceService = {
    async list(params: AttendanceFilterParams = { page: 1, limit: 10 }): Promise<PaginatedResponse<AttendanceResponse>> {
        return apiClient.get('/attendance', { params })
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

import { get, post } from "@/lib/api-client";
import {
    AttendanceEvent,
    CheckInPayload,
    CheckOutPayload,
    CorrectionPayload,
} from "@/types/entities";
import { PaginatedResponse } from "@/types/api";

export interface ListAttendanceParams {
    page?: number;
    limit?: number;
    memberId?: string;
    type?: string;
    from?: string;
    to?: string;
}

export async function getAttendance(
    params?: ListAttendanceParams,
): Promise<PaginatedResponse<AttendanceEvent>> {
    return get<PaginatedResponse<AttendanceEvent>>("/attendance", params as Record<string, unknown>);
}

export async function getAttendanceById(id: string): Promise<AttendanceEvent> {
    return get<AttendanceEvent>(`/attendance/${id}`);
}

export async function checkIn(payload: CheckInPayload): Promise<AttendanceEvent> {
    return post<AttendanceEvent>("/attendance/check-ins", payload);
}

export async function checkOut(payload: CheckOutPayload): Promise<AttendanceEvent> {
    return post<AttendanceEvent>("/attendance/check-outs", payload);
}

export async function createCorrection(payload: CorrectionPayload): Promise<AttendanceEvent> {
    return post<AttendanceEvent>("/attendance/corrections", payload);
}

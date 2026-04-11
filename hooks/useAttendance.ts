"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useApi";
import * as attendanceService from "@/services/attendance";
import { ListAttendanceParams } from "@/services/attendance";
import {
    AttendanceEvent,
    CheckInPayload,
    CheckOutPayload,
    CorrectionPayload,
} from "@/types/entities";
import { AppError } from "@/types/api";

export function useAttendance(params?: ListAttendanceParams) {
    return useQuery({
        queryKey: queryKeys.attendance.list(params as Record<string, unknown>),
        queryFn: () => attendanceService.getAttendance(params),
    });
}

export function useAttendanceEvent(id: string) {
    return useQuery({
        queryKey: queryKeys.attendance.detail(id),
        queryFn: () => attendanceService.getAttendanceById(id),
        enabled: !!id,
    });
}

export function useCheckIn() {
    const queryClient = useQueryClient();
    return useMutation<AttendanceEvent, AppError, CheckInPayload>({
        mutationFn: attendanceService.checkIn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all() });
        },
    });
}

export function useCheckOut() {
    const queryClient = useQueryClient();
    return useMutation<AttendanceEvent, AppError, CheckOutPayload>({
        mutationFn: attendanceService.checkOut,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all() });
        },
    });
}

export function useCreateCorrection() {
    const queryClient = useQueryClient();
    return useMutation<AttendanceEvent, AppError, CorrectionPayload>({
        mutationFn: attendanceService.createCorrection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all() });
        },
    });
}

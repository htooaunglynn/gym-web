"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import { AttendanceActionForm } from "@/components/features/attendance/AttendanceActionForm";
import { AttendanceEventTable } from "@/components/features/attendance/AttendanceEventTable";
import { useAttendance, useCheckIn, useCheckOut, useCreateCorrection } from "@/hooks/useAttendance";
import { useMembers } from "@/hooks/useMembers";
import { useToast } from "@/context/ToastContext";
import { PAGINATION } from "@/config/pagination";
import { CheckInFormValues, CheckOutFormValues, CorrectionFormValues } from "@/lib/validators";
import { AttendanceType } from "@/types/entities";

function toIsoIfProvided(value?: string) {
    if (!value) return undefined;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export default function AttendancePage() {
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [memberId, setMemberId] = useState("");
    const [type, setType] = useState<AttendanceType | "">("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const membersQuery = useMembers({ page: 1, limit: 200 });

    const attendanceParams = useMemo(
        () => ({
            page,
            limit: PAGINATION.attendance.limit,
            memberId: memberId || undefined,
            type: type || undefined,
            from: from || undefined,
            to: to || undefined,
        }),
        [page, memberId, type, from, to]
    );

    const attendanceQuery = useAttendance(attendanceParams);
    const checkInMutation = useCheckIn();
    const checkOutMutation = useCheckOut();
    const correctionMutation = useCreateCorrection();

    const memberOptions = (membersQuery.data?.data ?? []).map((m) => ({
        id: m.id,
        label: `${m.firstName} ${m.lastName}`,
    }));

    const events = attendanceQuery.data?.data ?? [];
    const meta = attendanceQuery.data?.meta;
    const totalItems = meta?.total ?? 0;
    const pageSize = meta?.limit ?? PAGINATION.attendance.limit;

    const handleCheckIn = (values: CheckInFormValues | CheckOutFormValues | CorrectionFormValues) => {
        const payload = values as CheckInFormValues;
        checkInMutation.mutate(
            {
                memberId: payload.memberId,
                timestamp: toIsoIfProvided(payload.timestamp),
                notes: payload.notes,
            },
            {
                onSuccess: () => toast.success("Check-in recorded"),
                onError: (error) => toast.error("Check-in failed", error.userMessage),
            }
        );
    };

    const handleCheckOut = (values: CheckInFormValues | CheckOutFormValues | CorrectionFormValues) => {
        const payload = values as CheckOutFormValues;
        checkOutMutation.mutate(
            {
                memberId: payload.memberId,
                timestamp: toIsoIfProvided(payload.timestamp),
                notes: payload.notes,
            },
            {
                onSuccess: () => toast.success("Check-out recorded"),
                onError: (error) => toast.error("Check-out failed", error.userMessage),
            }
        );
    };

    const handleCorrection = (values: CheckInFormValues | CheckOutFormValues | CorrectionFormValues) => {
        const payload = values as CorrectionFormValues;
        correctionMutation.mutate(
            {
                memberId: payload.memberId,
                type: payload.type,
                timestamp: toIsoIfProvided(payload.timestamp) || new Date().toISOString(),
                notes: payload.notes,
            },
            {
                onSuccess: () => toast.success("Correction recorded"),
                onError: (error) => toast.error("Correction failed", error.userMessage),
            }
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="display-lg text-on-surface">Attendance</h1>
                <p className="text-body-md text-on-surface-variant mt-1">
                    Record check-ins/check-outs and review attendance history.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Card variant="outlined">
                    <h2 className="title-md text-on-surface mb-3">Quick Check In</h2>
                    <AttendanceActionForm
                        mode="checkIn"
                        members={memberOptions}
                        isSubmitting={checkInMutation.isPending}
                        onSubmit={handleCheckIn}
                    />
                </Card>

                <Card variant="outlined">
                    <h2 className="title-md text-on-surface mb-3">Quick Check Out</h2>
                    <AttendanceActionForm
                        mode="checkOut"
                        members={memberOptions}
                        isSubmitting={checkOutMutation.isPending}
                        onSubmit={handleCheckOut}
                    />
                </Card>

                <Card variant="outlined">
                    <h2 className="title-md text-on-surface mb-3">Attendance Correction</h2>
                    <AttendanceActionForm
                        mode="correction"
                        members={memberOptions}
                        isSubmitting={correctionMutation.isPending}
                        onSubmit={handleCorrection}
                    />
                </Card>
            </div>

            <Card variant="outlined" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <select
                        value={memberId}
                        onChange={(e) => {
                            setMemberId(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Members</option>
                        {memberOptions.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value as AttendanceType | "");
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Types</option>
                        <option value="CHECK_IN">Check In</option>
                        <option value="CHECK_OUT">Check Out</option>
                        <option value="CORRECTION">Correction</option>
                    </select>

                    <input
                        type="date"
                        value={from}
                        onChange={(e) => {
                            setFrom(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    />

                    <input
                        type="date"
                        value={to}
                        onChange={(e) => {
                            setTo(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    />

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setMemberId("");
                            setType("");
                            setFrom("");
                            setTo("");
                            setPage(1);
                        }}
                    >
                        Reset Filters
                    </Button>
                </div>

                {attendanceQuery.isLoading ? (
                    <div className="py-10">
                        <LoadingSpinner text="Loading attendance..." />
                    </div>
                ) : attendanceQuery.isError ? (
                    <ErrorState
                        title="Could not load attendance"
                        message={attendanceQuery.error.userMessage}
                        onRetry={() => attendanceQuery.refetch()}
                    />
                ) : (
                    <>
                        <AttendanceEventTable events={events} />

                        <Pagination
                            currentPage={page}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </Card>
        </div>
    );
}

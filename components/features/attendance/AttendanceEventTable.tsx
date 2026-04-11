import React from "react";
import { AttendanceEvent } from "@/types/entities";
import { Badge } from "@/components/shared/Badge";
import { formatDateTime } from "@/lib/formatters";

interface AttendanceEventTableProps {
    events: AttendanceEvent[];
}

const typeMeta: Record<AttendanceEvent["type"], { label: string; variant: "info" | "success" | "warning" }> = {
    CHECK_IN: { label: "Check In", variant: "success" },
    CHECK_OUT: { label: "Check Out", variant: "info" },
    CORRECTION: { label: "Correction", variant: "warning" },
};

export function AttendanceEventTable({ events }: AttendanceEventTableProps) {
    return (
        <div className="overflow-x-auto rounded-md border border-outline-variant/30">
            <table className="w-full min-w-[980px]">
                <caption className="sr-only">Attendance event history by member and event type</caption>
                <thead className="bg-surface-container-low">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Member</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Type</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Timestamp</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Recorded</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Notes</th>
                    </tr>
                </thead>

                <tbody>
                    {events.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-on-surface-variant">
                                No attendance events found.
                            </td>
                        </tr>
                    ) : (
                        events.map((event) => (
                            <tr key={event.id} className="border-t border-outline-variant/20">
                                <td className="px-4 py-3">
                                    <p className="text-body-md font-semibold text-on-surface">
                                        {event.member
                                            ? `${event.member.firstName} ${event.member.lastName}`
                                            : event.memberId}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={typeMeta[event.type].variant} size="sm">
                                        {typeMeta[event.type].label}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface">
                                    {formatDateTime(event.timestamp)}
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface-variant">
                                    {formatDateTime(event.createdAt)}
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface-variant">
                                    {event.notes || "-"}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

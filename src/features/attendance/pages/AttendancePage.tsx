import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import PageHeader from '@/components/PageHeader/PageHeader'
import { Input } from '@/components/Input/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/select'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import { Button } from '@/components/ui/button'
import { useApiMutation, useApiQuery, queryKeys, useInvalidateQueries } from '@/hooks/useApi'
import { attendanceService, memberService } from '@/services'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { useToast } from '@/hooks/useToast'

interface AttendanceTableRow {
    id: string
    memberName: string
    memberAvatar: string
    eventType: 'CHECK_IN' | 'CHECK_OUT'
    occurredAt: string
    note: string
    isCorrection: boolean
}

export default function AttendancePage() {
    const { addToast } = useToast()
    const { invalidateAttendance } = useInvalidateQueries()
    const [query, setQuery] = useState('')
    const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'CHECK_IN' | 'CHECK_OUT'>('all')
    const [selectedMemberId, setSelectedMemberId] = useState<string>('')
    const [note, setNote] = useState('')
    const [correctionTargetId, setCorrectionTargetId] = useState('')
    const [correctionEventType, setCorrectionEventType] = useState<'CHECK_IN' | 'CHECK_OUT'>('CHECK_IN')

    const membersQuery = useApiQuery(
        [...queryKeys.members.lists(), 'attendance-member-selector'],
        () => memberService.list({ page: 1, limit: 100, includeDeleted: false })
    )

    const attendanceQuery = useApiQuery(
        queryKeys.attendance.list({ eventTypeFilter }),
        () =>
            attendanceService.list({
                page: 1,
                limit: 200,
                includeDeleted: false,
                ...(eventTypeFilter === 'all' ? {} : { eventType: eventTypeFilter }),
            })
    )

    const checkInMutation = useApiMutation((memberId: string) =>
        attendanceService.checkIn({
            memberId,
            occurredAt: new Date().toISOString(),
            note: note || 'Check in from dashboard',
        })
    )

    const checkOutMutation = useApiMutation((memberId: string) =>
        attendanceService.checkOut({
            memberId,
            occurredAt: new Date().toISOString(),
            note: note || 'Check out from dashboard',
        })
    )

    const correctionMutation = useApiMutation(() =>
        attendanceService.recordCorrection({
            memberId: selectedMemberId,
            correctedAttendanceEventId: correctionTargetId,
            eventType: correctionEventType,
            occurredAt: new Date().toISOString(),
            note: note || 'Correction from dashboard',
        })
    )

    const tableRows = useMemo<AttendanceTableRow[]>(() => {
        const rows = attendanceQuery.data?.data ?? []
        const memberMap = new Map((membersQuery.data?.data ?? []).map((m) => [m.id, m]))

        return rows
            .map((row) => {
                const member = memberMap.get(row.memberId)
                const fullName = member
                    ? `${member.firstName} ${member.lastName}`.trim()
                    : `Member ${row.memberId.slice(0, 6)}`
                return {
                    id: row.id,
                    memberName: fullName,
                    memberAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
                    eventType: row.eventType,
                    occurredAt: row.occurredAt,
                    note: row.note ?? '-',
                    isCorrection: row.isCorrection,
                }
            })
            .filter((row) => {
                if (!query) return true
                const normalized = query.toLowerCase()
                return (
                    row.memberName.toLowerCase().includes(normalized) ||
                    row.note.toLowerCase().includes(normalized) ||
                    row.eventType.toLowerCase().includes(normalized)
                )
            })
    }, [attendanceQuery.data, membersQuery.data, query])

    const weeklyAttendance = useMemo(() => {
        const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const counts = [0, 0, 0, 0, 0, 0, 0]

        tableRows.forEach((row) => {
            const day = new Date(row.occurredAt).getDay()
            counts[day] += 1
        })

        return labels.map((day, idx) => ({ day, count: counts[idx] }))
    }, [tableRows])

    const handleCheckIn = async () => {
        if (!selectedMemberId) {
            addToast('Select a member first', 'warning')
            return
        }

        try {
            await checkInMutation.mutateAsync(selectedMemberId)
            addToast('Member checked in successfully', 'success')
            setNote('')
            invalidateAttendance()
        } catch (error: any) {
            addToast(error?.userMessage ?? 'Failed to check in member', 'error')
        }
    }

    const handleCheckOut = async () => {
        if (!selectedMemberId) {
            addToast('Select a member first', 'warning')
            return
        }

        try {
            await checkOutMutation.mutateAsync(selectedMemberId)
            addToast('Member checked out successfully', 'success')
            setNote('')
            invalidateAttendance()
        } catch (error: any) {
            addToast(error?.userMessage ?? 'Failed to check out member', 'error')
        }
    }

    const handleCorrection = async () => {
        if (!selectedMemberId || !correctionTargetId) {
            addToast('Select member and target event id', 'warning')
            return
        }

        try {
            await correctionMutation.mutateAsync(undefined)
            addToast('Attendance correction recorded', 'success')
            setCorrectionTargetId('')
            setNote('')
            invalidateAttendance()
        } catch (error: any) {
            addToast(error?.userMessage ?? 'Failed to record correction', 'error')
        }
    }

    const columns: DataTableColumn<AttendanceTableRow>[] = [
        {
            key: 'member',
            header: 'Member',
            render: (record) => (
                <div className="flex items-center gap-2.5">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={record.memberAvatar} />
                        <AvatarFallback>{record.memberName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{record.memberName}</span>
                </div>
            ),
        },
        {
            key: 'eventType',
            header: 'Event',
            cellClassName: 'text-muted-foreground',
            render: (record) => record.eventType.replace('_', ' '),
        },
        {
            key: 'occurredAt',
            header: 'Time',
            cellClassName: 'text-muted-foreground',
            render: (record) => new Date(record.occurredAt).toLocaleString(),
        },
        { key: 'note', header: 'Note', render: (record) => record.note },
        { key: 'correction', header: 'Correction', render: (record) => (record.isCorrection ? 'Yes' : 'No') },
    ]

    if (attendanceQuery.isLoading || membersQuery.isLoading) {
        return (
            <div className="py-10">
                <LoadingSpinner />
            </div>
        )
    }

    if (attendanceQuery.error) {
        return <ErrorState message={attendanceQuery.error.userMessage} />
    }

    return (
        <div>
            <PageHeader title="Attendance" breadcrumb="GymHub / Attendance" />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-8">
                    <CardHeader>
                        <CardTitle>Attendance Logs</CardTitle>
                        <CardDescription>Daily check-in and check-out events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-3 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search member, event, or note"
                                    className="pl-9"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            <Select
                                value={eventTypeFilter}
                                onValueChange={(value: 'all' | 'CHECK_IN' | 'CHECK_OUT') => setEventTypeFilter(value)}
                            >
                                <SelectTrigger className="w-full md:w-64">
                                    <SelectValue placeholder="Filter by event" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Events</SelectItem>
                                    <SelectItem value="CHECK_IN">Check In</SelectItem>
                                    <SelectItem value="CHECK_OUT">Check Out</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DataTable
                            data={tableRows}
                            columns={columns}
                            getRowKey={(record) => record.id}
                            containerClassName="max-h-[420px]"
                            stickyHeader
                            emptyMessage="No attendance records found."
                        />
                    </CardContent>
                </Card>

                <Card className="xl:col-span-4">
                    <CardHeader>
                        <CardTitle>Attendance Actions</CardTitle>
                        <CardDescription>Check in, check out, and corrections</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                                {(membersQuery.data?.data ?? []).map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {`${member.firstName} ${member.lastName}`.trim()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Optional note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={handleCheckIn} disabled={checkInMutation.isPending}>
                                Check In
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCheckOut}
                                disabled={checkOutMutation.isPending}
                            >
                                Check Out
                            </Button>
                        </div>

                        <Input
                            placeholder="Correction target event ID"
                            value={correctionTargetId}
                            onChange={(e) => setCorrectionTargetId(e.target.value)}
                        />
                        <Select
                            value={correctionEventType}
                            onValueChange={(value: 'CHECK_IN' | 'CHECK_OUT') => setCorrectionEventType(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Correction event type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CHECK_IN">CHECK IN</SelectItem>
                                <SelectItem value="CHECK_OUT">CHECK OUT</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="secondary"
                            onClick={handleCorrection}
                            disabled={correctionMutation.isPending}
                            className="w-full"
                        >
                            Record Correction
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Attendance Trend</CardTitle>
                    <CardDescription>Events by weekday</CardDescription>
                </CardHeader>
                <CardContent className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyAttendance}>
                            <defs>
                                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="var(--color-chart-1)"
                                fill="url(#attendanceGradient)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

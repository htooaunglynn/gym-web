import { Navigate, useParams } from 'react-router'
import { Mail, Phone, MapPin, Calendar, User } from 'lucide-react'
import { useMemo } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import PageHeader from '@/components/PageHeader/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import { useApiQuery, queryKeys } from '@/hooks/useApi'
import { attendanceService, memberService } from '@/services'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'

interface MemberAttendanceRow {
    id: string
    eventType: 'CHECK_IN' | 'CHECK_OUT'
    occurredAt: string
    note: string
    isCorrection: boolean
}

export default function MemberDetail() {
    const { id } = useParams()

    const memberQuery = useApiQuery(
        id ? queryKeys.members.detail(id) : [...queryKeys.members.details(), 'missing-id'],
        () => memberService.getById(id as string),
        { enabled: Boolean(id) }
    )

    const attendanceQuery = useApiQuery(
        id
            ? queryKeys.attendance.list({ memberId: id, limit: 50, page: 1, includeDeleted: false })
            : [...queryKeys.attendance.lists(), 'missing-id'],
        () => attendanceService.list({ memberId: id, page: 1, limit: 50, includeDeleted: false }),
        { enabled: Boolean(id) }
    )

    if (memberQuery.isLoading) {
        return (
            <div className="py-10">
                <LoadingSpinner />
            </div>
        )
    }

    if (memberQuery.error) {
        return <ErrorState message={memberQuery.error.userMessage} />
    }

    const member = memberQuery.data

    if (!member) return <Navigate to="/admin/members" replace />

    const memberName = `${member.firstName} ${member.lastName}`.trim()

    const attendanceRows = useMemo<MemberAttendanceRow[]>(() => {
        const rows = attendanceQuery.data?.data ?? []
        return rows.map((row) => ({
            id: row.id,
            eventType: row.eventType,
            occurredAt: new Date(row.occurredAt).toLocaleString(),
            note: row.note ?? '-',
            isCorrection: row.isCorrection,
        }))
    }, [attendanceQuery.data])

    const attendanceByMonth = useMemo(() => {
        const sessions = attendanceQuery.data?.data ?? []
        const countMap = new Map<string, number>()

        sessions.forEach((session) => {
            const month = new Date(session.occurredAt).toLocaleString('en-US', { month: 'short' })
            countMap.set(month, (countMap.get(month) ?? 0) + 1)
        })

        return Array.from(countMap.entries()).map(([month, count]) => ({ month, sessions: count }))
    }, [attendanceQuery.data])

    const columns: DataTableColumn<MemberAttendanceRow>[] = [
        {
            key: 'event',
            header: 'Event',
            cellClassName: 'py-3',
            render: (row) => row.eventType.replace('_', ' '),
        },
        {
            key: 'occurredAt',
            header: 'Occurred At',
            cellClassName: 'py-3',
            render: (row) => row.occurredAt,
        },
        {
            key: 'note',
            header: 'Note',
            cellClassName: 'py-3 font-medium',
            render: (row) => row.note,
        },
        {
            key: 'correction',
            header: 'Correction',
            cellClassName: 'py-3 text-muted-foreground',
            render: (row) => (row.isCorrection ? 'Yes' : 'No'),
        },
    ]

    return (
        <div>
            <PageHeader title="Member Details" breadcrumb={`GymHub / Members / ${memberName}`} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-4">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center mb-4">
                            <Avatar className="w-24 h-24 mb-3 border-4 border-emerald-100">
                                <AvatarImage
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(memberName)}`}
                                />
                                <AvatarFallback>{memberName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold">{memberName}</h2>
                            <p className="text-sm text-muted-foreground">ID: {member.id.toUpperCase()}</p>
                            <div className="flex gap-2 mt-2">
                                <StatusBadge kind="member-plan" value="Standard" />
                                <StatusBadge kind="member-status" value={member.deletedAt ? 'Inactive' : 'Active'} />
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                <span>{member.email}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                <span>{member.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                <span>Address not provided</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                <span>Joined {new Date(member.createdAt).toISOString().slice(0, 10)}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                <span>
                                    Trainer:{' '}
                                    {member.trainer
                                        ? `${member.trainer.firstName} ${member.trainer.lastName}`
                                        : 'Unassigned'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-8">
                    <CardHeader>
                        <CardTitle>Attendance Trend</CardTitle>
                        <CardDescription>Monthly class sessions</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceByMonth.length ? attendanceByMonth : [{ month: 'N/A', sessions: 0 }]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sessions" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Events</CardTitle>
                    <CardDescription>Latest check-in and check-out events</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={attendanceRows}
                        columns={columns}
                        getRowKey={(row) => row.id}
                        emptyMessage="No attendance events found."
                    />
                </CardContent>
            </Card>
        </div>
    )
}

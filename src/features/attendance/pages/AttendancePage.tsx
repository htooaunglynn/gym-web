import { useState } from 'react'
import { Search } from 'lucide-react'
import type { AttendanceRecord } from '@/features/attendance/types'
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
import useSearch from '@/hooks/useSearch'
import { attendanceRecords, weeklyAttendance } from '@/features/attendance/data'

export default function AttendancePage() {
    const [classFilter, setClassFilter] = useState('all')

    const classNames = Array.from(new Set(attendanceRecords.map((r) => r.className))).sort()

    const search = useSearch(attendanceRecords, (record, normalizedQuery) =>
        record.memberName.toLowerCase().includes(normalizedQuery) ||
        record.className.toLowerCase().includes(normalizedQuery) ||
        record.trainer.toLowerCase().includes(normalizedQuery)
    )

    const filtered = search.filtered.filter((record) =>
        classFilter === 'all' || record.className === classFilter
    )

    const columns: DataTableColumn<AttendanceRecord>[] = [
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
        { key: 'className', header: 'Class', render: (record) => record.className },
        { key: 'trainer', header: 'Trainer', render: (record) => record.trainer },
        {
            key: 'date',
            header: 'Date',
            cellClassName: 'text-muted-foreground',
            render: (record) => record.date,
        },
        { key: 'checkIn', header: 'Check-in', render: (record) => record.checkIn },
        { key: 'checkOut', header: 'Check-out', render: (record) => record.checkOut },
    ]

    return (
        <div>
            <PageHeader title="Attendance" breadcrumb="GymHub / Attendance" />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-8">
                    <CardHeader>
                        <CardTitle>Attendance Logs</CardTitle>
                        <CardDescription>Daily check-in and class attendance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-3 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search member, class, or trainer"
                                    className="pl-9"
                                    value={search.query}
                                    onChange={(e) => search.setQuery(e.target.value)}
                                />
                            </div>
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-full md:w-64">
                                    <SelectValue placeholder="Filter by class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classNames.map((name) => (
                                        <SelectItem key={name} value={name}>{name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DataTable
                            data={filtered}
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
                        <CardTitle>Weekly Attendance Trend</CardTitle>
                        <CardDescription>Check-ins by weekday</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[420px]">
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
        </div>
    )
}

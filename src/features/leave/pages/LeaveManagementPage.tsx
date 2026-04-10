import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from 'recharts'
import type { LeaveRequest } from '@/features/leave/types'
import PageHeader from '@/components/PageHeader/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import { leaveRequests } from '@/features/leave/data'

const leaveTypeStats = [
    { name: 'Annual', value: 42, color: 'var(--color-chart-1)' },
    { name: 'Sick', value: 26, color: 'var(--color-chart-2)' },
    { name: 'Personal', value: 20, color: 'var(--color-chart-3)' },
    { name: 'Emergency', value: 12, color: 'var(--color-chart-4)' },
]

export default function LeaveManagementPage() {
    const columns: DataTableColumn<LeaveRequest>[] = [
        {
            key: 'trainer',
            header: 'Trainer',
            render: (request) => (
                <div className="flex items-center gap-2.5">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={request.trainerAvatar} />
                        <AvatarFallback>{request.trainerName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{request.trainerName}</span>
                </div>
            ),
        },
        { key: 'type', header: 'Type', render: (request) => request.type },
        {
            key: 'dateRange',
            header: 'Date Range',
            cellClassName: 'text-muted-foreground',
            render: (request) => `${request.startDate} to ${request.endDate}`,
        },
        { key: 'days', header: 'Days', render: (request) => request.days },
        {
            key: 'reason',
            header: 'Reason',
            cellClassName: 'text-muted-foreground',
            render: (request) => request.reason,
        },
        {
            key: 'status',
            header: 'Status',
            render: (request) => <StatusBadge kind="leave-status" value={request.status} />,
        },
    ]

    return (
        <div>
            <PageHeader title="Leave Management" breadcrumb="GymHub / Leave Management" />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-4">
                    <CardHeader>
                        <CardTitle>Leave Types</CardTitle>
                        <CardDescription>Distribution across requests</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={leaveTypeStats}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={105}
                                    label={({ name, value }) => `${name}: ${value}%`}
                                >
                                    {leaveTypeStats.map((item) => (
                                        <Cell key={item.name} fill={item.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-8">
                    <CardHeader>
                        <CardTitle>Leave Requests</CardTitle>
                        <CardDescription>Trainer requests and approval status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={leaveRequests}
                            columns={columns}
                            getRowKey={(request) => request.id}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

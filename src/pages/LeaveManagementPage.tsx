import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from 'recharts'
import PageHeader from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { leaveRequests } from '@/data/performance'

const leaveTypeStats = [
    { name: 'Annual', value: 42, color: 'var(--color-chart-1)' },
    { name: 'Sick', value: 26, color: 'var(--color-chart-2)' },
    { name: 'Personal', value: 20, color: 'var(--color-chart-3)' },
    { name: 'Emergency', value: 12, color: 'var(--color-chart-4)' },
]

export default function LeaveManagementPage() {
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
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-muted-foreground">
                                        <th className="text-left py-2 font-medium">Trainer</th>
                                        <th className="text-left py-2 font-medium">Type</th>
                                        <th className="text-left py-2 font-medium">Date Range</th>
                                        <th className="text-left py-2 font-medium">Days</th>
                                        <th className="text-left py-2 font-medium">Reason</th>
                                        <th className="text-left py-2 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveRequests.map((request) => (
                                        <tr key={request.id} className="border-b last:border-0">
                                            <td className="py-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={request.trainerAvatar} />
                                                        <AvatarFallback>{request.trainerName.slice(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{request.trainerName}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5">{request.type}</td>
                                            <td className="py-2.5 text-muted-foreground">
                                                {request.startDate} to {request.endDate}
                                            </td>
                                            <td className="py-2.5">{request.days}</td>
                                            <td className="py-2.5 text-muted-foreground">{request.reason}</td>
                                            <td className="py-2.5">
                                                <Badge
                                                    variant={
                                                        request.status === 'Approved'
                                                            ? 'success'
                                                            : request.status === 'Pending'
                                                                ? 'warning'
                                                                : 'danger'
                                                    }
                                                >
                                                    {request.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

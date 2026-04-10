import { Navigate, useParams } from 'react-router'
import { Mail, Phone, MapPin, Calendar, User } from 'lucide-react'
import type { Payment } from '@/features/payroll/types'
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
import { members } from '@/features/members/data'
import { payments } from '@/features/payroll/data'

const attendanceByMonth = [
    { month: 'Jan', sessions: 12 },
    { month: 'Feb', sessions: 15 },
    { month: 'Mar', sessions: 13 },
    { month: 'Apr', sessions: 16 },
    { month: 'May', sessions: 14 },
    { month: 'Jun', sessions: 18 },
]

export default function MemberDetail() {
    const { id } = useParams()
    const member = members.find((m) => m.id === id)

    if (!member) return <Navigate to="/admin/members" replace />

    const memberPayments = payments.filter((p) => p.memberId === member.id)
    const columns: DataTableColumn<Payment>[] = [
        {
            key: 'invoice',
            header: 'Invoice ID',
            cellClassName: 'py-3',
            render: (payment) => `#${payment.id.toUpperCase()}`,
        },
        {
            key: 'plan',
            header: 'Plan',
            cellClassName: 'py-3',
            render: (payment) => payment.plan,
        },
        {
            key: 'amount',
            header: 'Amount',
            cellClassName: 'py-3 font-medium',
            render: (payment) => `$${payment.amount}`,
        },
        {
            key: 'date',
            header: 'Date',
            cellClassName: 'py-3 text-muted-foreground',
            render: (payment) => payment.date,
        },
        {
            key: 'status',
            header: 'Status',
            cellClassName: 'py-3',
            render: (payment) => <StatusBadge kind="payment-status" value={payment.status} />,
        },
    ]

    return (
        <div>
            <PageHeader title="Member Details" breadcrumb={`GymHub / Members / ${member.name}`} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-4">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center mb-4">
                            <Avatar className="w-24 h-24 mb-3 border-4 border-emerald-100">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold">{member.name}</h2>
                            <p className="text-sm text-muted-foreground">ID: {member.id.toUpperCase()}</p>
                            <div className="flex gap-2 mt-2">
                                <StatusBadge kind="member-plan" value={member.plan} />
                                <StatusBadge kind="member-status" value={member.status} />
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
                                <span>{member.address}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                <span>Joined {member.joinDate}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                <span>Trainer: {member.trainer}</span>
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
                            <BarChart data={attendanceByMonth}>
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
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Latest billing transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={memberPayments}
                        columns={columns}
                        getRowKey={(payment) => payment.id}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

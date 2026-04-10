import {
    Users,
    Wallet,
    CalendarCheck,
    Activity,
    Clock,
    CircleDollarSign,
} from 'lucide-react'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts'
import type { Member } from '@/features/members/types'
import PageHeader from '@/components/PageHeader/PageHeader'
import StatCard from '@/components/StatCard/StatCard'
import { Badge } from '@/components/Badge/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import { members } from '@/features/members/data'
import { monthlyStats, planDistribution } from '@/features/performance/data'
import { weeklyAttendance } from '@/features/attendance/data'
import { classes } from '@/features/schedule/data'

export default function Dashboard() {
    const totalMembers = members.length
    const activeMembers = members.filter((m) => m.status === 'Active').length
    const todayRevenue = 1840
    const todayClasses = classes.filter((c) => c.date === '2026-04-05')
    const recentMembers = members.slice(0, 7)

    const recentColumns: DataTableColumn<Member>[] = [
        {
            key: 'member',
            header: 'Member',
            cellClassName: 'py-3',
            render: (member) => (
                <div className="flex items-center gap-2.5">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'plan',
            header: 'Plan',
            cellClassName: 'py-3',
            render: (member) => member.plan,
        },
        {
            key: 'trainer',
            header: 'Trainer',
            cellClassName: 'py-3',
            render: (member) => member.trainer,
        },
        {
            key: 'status',
            header: 'Status',
            cellClassName: 'py-3',
            render: (member) => <StatusBadge kind="member-status" value={member.status} />,
        },
        {
            key: 'joinDate',
            header: 'Join Date',
            cellClassName: 'py-3 text-muted-foreground',
            render: (member) => member.joinDate,
        },
    ]

    return (
        <div>
            <PageHeader title="Dashboard" breadcrumb="GymHub / Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Members"
                    value={totalMembers}
                    delta="+12% from last month"
                    icon={Users}
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-600"
                />
                <StatCard
                    title="Active Members"
                    value={activeMembers}
                    delta="+6% from last week"
                    icon={Activity}
                    iconBg="bg-cyan-100"
                    iconColor="text-cyan-600"
                />
                <StatCard
                    title="Today's Revenue"
                    value={`$${todayRevenue.toLocaleString()}`}
                    delta="+9% from yesterday"
                    icon={Wallet}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                />
                <StatCard
                    title="Classes Today"
                    value={todayClasses.length}
                    delta="2 classes full"
                    deltaType="neutral"
                    icon={CalendarCheck}
                    iconBg="bg-violet-100"
                    iconColor="text-violet-600"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-7">
                    <CardHeader>
                        <CardTitle>Membership Growth</CardTitle>
                        <CardDescription>Monthly member count trend</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyStats}>
                                <defs>
                                    <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="members"
                                    stroke="var(--color-chart-1)"
                                    fill="url(#memberGradient)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-5">
                    <CardHeader>
                        <CardTitle>Plan Distribution</CardTitle>
                        <CardDescription>Active subscriptions</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={planDistribution}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={95}
                                    label={({ name, value }) => `${name}: ${value}%`}
                                >
                                    {planDistribution.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-7">
                    <CardHeader>
                        <CardTitle>Weekly Attendance</CardTitle>
                        <CardDescription>Member check-ins by day</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyAttendance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-5">
                    <CardHeader>
                        <CardTitle>Today's Classes</CardTitle>
                        <CardDescription>{todayClasses.length} classes scheduled</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-72 overflow-auto">
                        {todayClasses.map((session) => (
                            <div key={session.id} className="p-3 rounded-lg border bg-muted/30">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-sm">{session.name}</p>
                                    <Badge variant="secondary">{session.type}</Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {session.startTime} - {session.endTime}
                                    </span>
                                    <span>{session.enrolled}/{session.capacity} enrolled</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Trainer: {session.trainer}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <Card className="xl:col-span-8">
                    <CardHeader>
                        <CardTitle>Recent Members</CardTitle>
                        <CardDescription>Latest signups and activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={recentMembers}
                            columns={recentColumns}
                            getRowKey={(member) => member.id}
                        />
                    </CardContent>
                </Card>

                <Card className="xl:col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Snapshot</CardTitle>
                        <CardDescription>This month</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                            <p className="text-sm text-emerald-700 mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-emerald-700">$12,450</p>
                            <p className="text-xs text-emerald-600 mt-1">+8.4% vs last month</p>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground inline-flex items-center gap-1">
                                    <CircleDollarSign className="w-4 h-4" /> Premium Plans
                                </span>
                                <span className="font-semibold">$6,850</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Standard Plans</span>
                                <span className="font-semibold">$3,520</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Basic Plans</span>
                                <span className="font-semibold">$2,080</span>
                            </div>
                        </div>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyStats.slice(-6)}>
                                    <XAxis dataKey="month" hide />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="var(--color-chart-1)"
                                        fill="var(--color-chart-1)"
                                        fillOpacity={0.2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

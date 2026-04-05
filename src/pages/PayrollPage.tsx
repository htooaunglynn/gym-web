import {
    DollarSign,
    Wallet,
    Clock3,
    AlertCircle,
    TrendingUp,
} from 'lucide-react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import PageHeader from '@/components/shared/PageHeader'
import StatCard from '@/components/shared/StatCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { payments, monthlyRevenue } from '@/data/payroll'

export default function PayrollPage() {
    const totalRevenue = payments
        .filter((p) => p.status === 'Paid')
        .reduce((sum, payment) => sum + payment.amount, 0)
    const pending = payments.filter((p) => p.status === 'Pending').length
    const overdue = payments.filter((p) => p.status === 'Overdue').length

    return (
        <div>
            <PageHeader title="Payroll / Payments" breadcrumb="GymHub / Payroll" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Collected Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    delta="+8.4% month-over-month"
                    icon={DollarSign}
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-600"
                />
                <StatCard
                    title="Average Ticket"
                    value="$92"
                    delta="+3.1% from last month"
                    icon={Wallet}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Pending Invoices"
                    value={pending}
                    delta="Awaiting payment"
                    deltaType="neutral"
                    icon={Clock3}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                />
                <StatCard
                    title="Overdue Invoices"
                    value={overdue}
                    delta="Needs follow-up"
                    deltaType="negative"
                    icon={AlertCircle}
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-7">
                    <CardHeader>
                        <CardTitle>Monthly Revenue</CardTitle>
                        <CardDescription>Income trend across the year</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--color-chart-1)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--color-chart-1)' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-5">
                    <CardHeader>
                        <CardTitle>Collections Overview</CardTitle>
                        <CardDescription>Current period</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-100">
                            <p className="text-sm text-emerald-700 mb-1">Collection Rate</p>
                            <p className="text-3xl font-bold text-emerald-700">89%</p>
                            <p className="text-xs text-emerald-700 mt-1 inline-flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +5% vs last period
                            </p>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Paid invoices</span>
                                <span className="font-medium">18</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pending invoices</span>
                                <span className="font-medium">{pending}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Overdue invoices</span>
                                <span className="font-medium text-red-600">{overdue}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payments List</CardTitle>
                    <CardDescription>All recent membership payments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground">
                                    <th className="text-left py-2 font-medium">Member</th>
                                    <th className="text-left py-2 font-medium">Plan</th>
                                    <th className="text-left py-2 font-medium">Amount</th>
                                    <th className="text-left py-2 font-medium">Method</th>
                                    <th className="text-left py-2 font-medium">Date</th>
                                    <th className="text-left py-2 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="border-b last:border-0">
                                        <td className="py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={payment.memberAvatar} />
                                                    <AvatarFallback>{payment.memberName.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{payment.memberName}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5">{payment.plan}</td>
                                        <td className="py-2.5 font-medium">${payment.amount}</td>
                                        <td className="py-2.5 text-muted-foreground">{payment.method}</td>
                                        <td className="py-2.5 text-muted-foreground">{payment.date}</td>
                                        <td className="py-2.5">
                                            <Badge
                                                variant={
                                                    payment.status === 'Paid'
                                                        ? 'success'
                                                        : payment.status === 'Pending'
                                                            ? 'warning'
                                                            : 'danger'
                                                }
                                            >
                                                {payment.status}
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
    )
}

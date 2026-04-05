import { useState } from 'react'
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
import PageHeader from '@/components/shared/PageHeader'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { attendanceRecords, weeklyAttendance } from '@/data/attendance'

export default function AttendancePage() {
    const [query, setQuery] = useState('')
    const [classFilter, setClassFilter] = useState('all')

    const classNames = Array.from(new Set(attendanceRecords.map((r) => r.className))).sort()

    const lowered = query.toLowerCase()
    const filtered = attendanceRecords.filter((record) => {
        const byQuery =
            record.memberName.toLowerCase().includes(lowered) ||
            record.className.toLowerCase().includes(lowered) ||
            record.trainer.toLowerCase().includes(lowered)
        const byClass = classFilter === 'all' || record.className === classFilter
        return byQuery && byClass
    })

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
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
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

                        <div className="overflow-x-auto max-h-[420px]">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-white z-10">
                                    <tr className="border-b text-muted-foreground">
                                        <th className="text-left py-2 font-medium">Member</th>
                                        <th className="text-left py-2 font-medium">Class</th>
                                        <th className="text-left py-2 font-medium">Trainer</th>
                                        <th className="text-left py-2 font-medium">Date</th>
                                        <th className="text-left py-2 font-medium">Check-in</th>
                                        <th className="text-left py-2 font-medium">Check-out</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((record) => (
                                        <tr key={record.id} className="border-b last:border-0">
                                            <td className="py-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={record.memberAvatar} />
                                                        <AvatarFallback>{record.memberName.slice(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{record.memberName}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5">{record.className}</td>
                                            <td className="py-2.5">{record.trainer}</td>
                                            <td className="py-2.5 text-muted-foreground">{record.date}</td>
                                            <td className="py-2.5">{record.checkIn}</td>
                                            <td className="py-2.5">{record.checkOut}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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

import { UserPlus, Clock3, BadgeCheck, BadgeX } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import type { Applicant } from '@/types'
import PageHeader from '@/components/shared/PageHeader'
import StatCard from '@/components/shared/StatCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import DataTable, { type DataTableColumn } from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { applicants, applicationsByMonth } from '@/data/recruitment'

export default function RecruitmentPage() {
    const pending = applicants.filter((a) => a.status === 'Pending').length
    const accepted = applicants.filter((a) => a.status === 'Accepted').length
    const rejected = applicants.filter((a) => a.status === 'Rejected').length
    const columns: DataTableColumn<Applicant>[] = [
        {
            key: 'candidate',
            header: 'Candidate',
            render: (candidate) => (
                <div className="flex items-center gap-2.5">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.email}</p>
                    </div>
                </div>
            ),
        },
        { key: 'position', header: 'Position', render: (candidate) => candidate.position },
        { key: 'experience', header: 'Experience', render: (candidate) => candidate.experience },
        {
            key: 'appliedDate',
            header: 'Applied Date',
            cellClassName: 'text-muted-foreground',
            render: (candidate) => candidate.appliedDate,
        },
        {
            key: 'status',
            header: 'Status',
            render: (candidate) => <StatusBadge kind="recruitment-status" value={candidate.status} />,
        },
    ]

    return (
        <div>
            <PageHeader title="Recruitment" breadcrumb="GymHub / Recruitment" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Applicants" value={applicants.length} delta="+14% this month" icon={UserPlus} />
                <StatCard title="Pending" value={pending} delta="Need review" deltaType="neutral" icon={Clock3} iconBg="bg-amber-100" iconColor="text-amber-600" />
                <StatCard title="Accepted" value={accepted} delta="Strong funnel" icon={BadgeCheck} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
                <StatCard title="Rejected" value={rejected} delta="Screened out" deltaType="negative" icon={BadgeX} iconBg="bg-red-100" iconColor="text-red-600" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-7">
                    <CardHeader>
                        <CardTitle>Applications Trend</CardTitle>
                        <CardDescription>Monthly incoming applicants</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={applicationsByMonth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-5">
                    <CardHeader>
                        <CardTitle>Pipeline Overview</CardTitle>
                        <CardDescription>Current hiring status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="p-3 rounded-lg border bg-muted/20">
                            <p className="text-sm text-muted-foreground mb-1">Interview Stage</p>
                            <p className="text-2xl font-bold">3</p>
                        </div>
                        <div className="p-3 rounded-lg border bg-muted/20">
                            <p className="text-sm text-muted-foreground mb-1">Offer Sent</p>
                            <p className="text-2xl font-bold">1</p>
                        </div>
                        <div className="p-3 rounded-lg border bg-muted/20">
                            <p className="text-sm text-muted-foreground mb-1">Open Positions</p>
                            <p className="text-2xl font-bold">6</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Applicants List</CardTitle>
                    <CardDescription>Recent candidates and status</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={applicants}
                        columns={columns}
                        getRowKey={(candidate) => candidate.id}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

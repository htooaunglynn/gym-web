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
import PageHeader from '@/components/shared/PageHeader'
import StatCard from '@/components/shared/StatCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const applicants = [
    { id: 'r001', name: 'Olivia Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia', position: 'Fitness Trainer', email: 'olivia.santos@example.com', phone: '+1 555 110 2000', appliedDate: '2026-03-22', experience: '4 years', status: 'Interview' },
    { id: 'r002', name: 'Noah Ali', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah', position: 'Front Desk Executive', email: 'noah.ali@example.com', phone: '+1 555 110 2001', appliedDate: '2026-03-24', experience: '3 years', status: 'Pending' },
    { id: 'r003', name: 'Maya Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', position: 'Nutrition Coach', email: 'maya.chen@example.com', phone: '+1 555 110 2002', appliedDate: '2026-03-25', experience: '5 years', status: 'Accepted' },
    { id: 'r004', name: 'Aiden Moore', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden', position: 'Strength Coach', email: 'aiden.moore@example.com', phone: '+1 555 110 2003', appliedDate: '2026-03-26', experience: '6 years', status: 'Interview' },
    { id: 'r005', name: 'Sara Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', position: 'Yoga Instructor', email: 'sara.kim@example.com', phone: '+1 555 110 2004', appliedDate: '2026-03-27', experience: '2 years', status: 'Pending' },
    { id: 'r006', name: 'Leo Martins', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LeoR', position: 'Operations Assistant', email: 'leo.martins@example.com', phone: '+1 555 110 2005', appliedDate: '2026-03-28', experience: '4 years', status: 'Rejected' },
    { id: 'r007', name: 'Emma Carter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaR', position: 'Group Class Trainer', email: 'emma.carter@example.com', phone: '+1 555 110 2006', appliedDate: '2026-03-29', experience: '3 years', status: 'Interview' },
    { id: 'r008', name: 'Yusuf Khan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yusuf', position: 'Receptionist', email: 'yusuf.khan@example.com', phone: '+1 555 110 2007', appliedDate: '2026-03-30', experience: '2 years', status: 'Pending' },
]

const applicationByMonth = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 17 },
    { month: 'Mar', count: 24 },
    { month: 'Apr', count: 21 },
    { month: 'May', count: 26 },
    { month: 'Jun', count: 18 },
]

export default function RecruitmentPage() {
    const pending = applicants.filter((a) => a.status === 'Pending').length
    const accepted = applicants.filter((a) => a.status === 'Accepted').length
    const rejected = applicants.filter((a) => a.status === 'Rejected').length

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
                            <BarChart data={applicationByMonth}>
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground">
                                    <th className="text-left py-2 font-medium">Candidate</th>
                                    <th className="text-left py-2 font-medium">Position</th>
                                    <th className="text-left py-2 font-medium">Experience</th>
                                    <th className="text-left py-2 font-medium">Applied Date</th>
                                    <th className="text-left py-2 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.map((candidate) => (
                                    <tr key={candidate.id} className="border-b last:border-0">
                                        <td className="py-2.5">
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
                                        </td>
                                        <td className="py-2.5">{candidate.position}</td>
                                        <td className="py-2.5">{candidate.experience}</td>
                                        <td className="py-2.5 text-muted-foreground">{candidate.appliedDate}</td>
                                        <td className="py-2.5">
                                            <Badge
                                                variant={
                                                    candidate.status === 'Accepted'
                                                        ? 'success'
                                                        : candidate.status === 'Rejected'
                                                            ? 'danger'
                                                            : candidate.status === 'Interview'
                                                                ? 'info'
                                                                : 'warning'
                                                }
                                            >
                                                {candidate.status}
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

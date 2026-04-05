import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { members } from '@/data/members'

export default function MembersList() {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [planFilter, setPlanFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const lowered = query.toLowerCase()
    const filteredMembers = members.filter((member) => {
        const matchesQuery =
            member.name.toLowerCase().includes(lowered) ||
            member.email.toLowerCase().includes(lowered) ||
            member.phone.toLowerCase().includes(lowered)
        const matchesPlan = planFilter === 'all' || member.plan === planFilter
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter
        return matchesQuery && matchesPlan && matchesStatus
    })

    return (
        <div>
            <PageHeader title="Members" breadcrumb="GymHub / Members" />

            <Card className="mb-4">
                <CardContent className="p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or phone"
                            className="pl-9"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select value={planFilter} onValueChange={setPlanFilter}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Plans</SelectItem>
                                <SelectItem value="Basic">Basic</SelectItem>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground bg-muted/30">
                                    <th className="text-left py-3 px-4 font-medium">Member</th>
                                    <th className="text-left py-3 px-4 font-medium">Plan</th>
                                    <th className="text-left py-3 px-4 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 font-medium">Trainer</th>
                                    <th className="text-left py-3 px-4 font-medium">Attendance</th>
                                    <th className="text-left py-3 px-4 font-medium">Join Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => (
                                    <tr
                                        key={member.id}
                                        className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/members/${member.id}`)}
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-9 h-9">
                                                    <AvatarImage src={member.avatar} />
                                                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-foreground">{member.name}</p>
                                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge variant={member.plan === 'Premium' ? 'success' : member.plan === 'Standard' ? 'info' : 'secondary'}>
                                                {member.plan}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge
                                                variant={
                                                    member.status === 'Active'
                                                        ? 'success'
                                                        : member.status === 'Suspended'
                                                            ? 'warning'
                                                            : 'secondary'
                                                }
                                            >
                                                {member.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">{member.trainer}</td>
                                        <td className="py-3 px-4">{member.attendanceRate}%</td>
                                        <td className="py-3 px-4 text-muted-foreground">{member.joinDate}</td>
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

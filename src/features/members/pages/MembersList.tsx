import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import type { Member } from '@/features/members/types'
import PageHeader from '@/components/PageHeader/PageHeader'
import { Input } from '@/components/Input/input'
import { Card, CardContent } from '@/components/Card/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/select'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import { useMembers } from '@/features/members/hooks'

export default function MembersList() {
    const navigate = useNavigate()
    const [planFilter, setPlanFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const { query, setQuery, filteredMembers } = useMembers({ planFilter, statusFilter })

    const columns: DataTableColumn<Member>[] = [
        {
            key: 'member',
            header: 'Member',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (member) => (
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
            ),
        },
        {
            key: 'plan',
            header: 'Plan',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (member) => <StatusBadge kind="member-plan" value={member.plan} />,
        },
        {
            key: 'status',
            header: 'Status',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (member) => <StatusBadge kind="member-status" value={member.status} />,
        },
        {
            key: 'trainer',
            header: 'Trainer',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (member) => member.trainer,
        },
        {
            key: 'attendance',
            header: 'Attendance',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (member) => `${member.attendanceRate}%`,
        },
        {
            key: 'joinDate',
            header: 'Join Date',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4 text-muted-foreground',
            render: (member) => member.joinDate,
        },
    ]

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
                    <DataTable
                        data={filteredMembers}
                        columns={columns}
                        getRowKey={(member) => member.id}
                        onRowClick={(member) => navigate(`/admin/members/${member.id}`)}
                        rowClassName="hover:bg-muted/30 transition-colors"
                        emptyMessage="No members found."
                    />
                </CardContent>
            </Card>
        </div>
    )
}

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import PageHeader from '@/components/PageHeader/PageHeader'
import { Input } from '@/components/Input/input'
import { Card, CardContent } from '@/components/Card/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/select'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import { useMembers, type MemberListItem } from '@/features/members/hooks/useMembers'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'
import { useApiMutation, useApiQuery, queryKeys, useInvalidateQueries } from '@/hooks/useApi'
import { memberService, trainerService } from '@/services'
import { useToast } from '@/hooks/useToast'

interface MemberFormState {
    firstName: string
    lastName: string
    email: string
    phone: string
    trainerId: string
}

const initialFormState: MemberFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    trainerId: 'none',
}

export default function MembersList() {
    const navigate = useNavigate()
    const { addToast } = useToast()
    const { invalidateMembers } = useInvalidateQueries()
    const [planFilter, setPlanFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
    const [selectedMember, setSelectedMember] = useState<MemberListItem | null>(null)
    const [formState, setFormState] = useState<MemberFormState>(initialFormState)
    const { query, setQuery, filteredMembers, isLoading, errorMessage } = useMembers({
        planFilter,
        statusFilter,
    })

    const trainersQuery = useApiQuery(
        [...queryKeys.trainers.lists(), 'member-form-trainers'],
        () => trainerService.list({ page: 1, limit: 100, includeDeleted: false, includeMembers: false })
    )

    const createMemberMutation = useApiMutation((payload: MemberFormState) =>
        memberService.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            trainerId: payload.trainerId === 'none' ? null : payload.trainerId,
        })
    )

    const updateMemberMutation = useApiMutation((payload: { id: string; form: MemberFormState }) =>
        memberService.update(payload.id, {
            firstName: payload.form.firstName,
            lastName: payload.form.lastName,
            phone: payload.form.phone,
            trainerId: payload.form.trainerId === 'none' ? null : payload.form.trainerId,
        })
    )

    const deleteMemberMutation = useApiMutation((id: string) => memberService.delete(id))

    const openCreateForm = () => {
        setFormMode('create')
        setSelectedMember(null)
        setFormState(initialFormState)
    }

    const openEditForm = (member: MemberListItem) => {
        setFormMode('edit')
        setSelectedMember(member)
        const [firstName, ...rest] = member.name.split(' ')
        setFormState({
            firstName: firstName ?? '',
            lastName: rest.join(' '),
            email: member.email,
            phone: member.phone,
            trainerId: 'none',
        })
    }

    const closeForm = () => {
        setFormMode(null)
        setSelectedMember(null)
        setFormState(initialFormState)
    }

    const submitForm = async () => {
        if (!formState.firstName || !formState.lastName || !formState.email || !formState.phone) {
            addToast('First name, last name, email, and phone are required', 'warning')
            return
        }

        try {
            if (formMode === 'create') {
                await createMemberMutation.mutateAsync(formState)
                addToast('Member created successfully', 'success')
            }

            if (formMode === 'edit' && selectedMember) {
                await updateMemberMutation.mutateAsync({ id: selectedMember.id, form: formState })
                addToast('Member updated successfully', 'success')
            }

            closeForm()
            invalidateMembers()
        } catch (error: any) {
            addToast(error?.userMessage ?? 'Failed to save member', 'error')
        }
    }

    const handleDelete = async (member: MemberListItem) => {
        const confirmed = window.confirm(`Delete ${member.name}?`)
        if (!confirmed) {
            return
        }

        try {
            await deleteMemberMutation.mutateAsync(member.id)
            addToast('Member deleted successfully', 'success')
            invalidateMembers()
        } catch (error: any) {
            addToast(error?.userMessage ?? 'Failed to delete member', 'error')
        }
    }

    const columns: DataTableColumn<MemberListItem>[] = [
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
        {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (member) => (
                <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => openEditForm(member)}>
                        Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => void handleDelete(member)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div>
            <PageHeader title="Members" breadcrumb="GymHub / Members">
                <Button onClick={openCreateForm}>
                    Add Member
                </Button>
            </PageHeader>

            {formMode ? (
                <Card className="mb-4">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                                placeholder="First name"
                                value={formState.firstName}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, firstName: event.target.value }))
                                }
                            />
                            <Input
                                placeholder="Last name"
                                value={formState.lastName}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, lastName: event.target.value }))
                                }
                            />
                            <Input
                                placeholder="Email"
                                type="email"
                                value={formState.email}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, email: event.target.value }))
                                }
                                disabled={formMode === 'edit'}
                            />
                            <Input
                                placeholder="Phone"
                                value={formState.phone}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, phone: event.target.value }))
                                }
                            />
                            <Select
                                value={formState.trainerId}
                                onValueChange={(value) => setFormState((prev) => ({ ...prev, trainerId: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Assign trainer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Unassigned</SelectItem>
                                    {(trainersQuery.data?.data ?? []).map((trainer) => (
                                        <SelectItem key={trainer.id} value={trainer.id}>
                                            {`${trainer.firstName} ${trainer.lastName}`.trim()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-3 flex justify-end gap-2">
                            <Button variant="outline" onClick={closeForm}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => void submitForm()}
                                disabled={createMemberMutation.isPending || updateMemberMutation.isPending}
                            >
                                {formMode === 'create' ? 'Create Member' : 'Update Member'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : null}

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
                    {isLoading ? (
                        <div className="py-10">
                            <LoadingSpinner />
                        </div>
                    ) : errorMessage ? (
                        <div className="p-4">
                            <ErrorState message={errorMessage} />
                        </div>
                    ) : (
                        <DataTable
                            data={filteredMembers}
                            columns={columns}
                            getRowKey={(member) => member.id}
                            onRowClick={(member) => navigate(`/admin/members/${member.id}`)}
                            rowClassName="hover:bg-muted/30 transition-colors"
                            emptyMessage="No members found."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

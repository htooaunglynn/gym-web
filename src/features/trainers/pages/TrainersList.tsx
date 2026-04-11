import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import PageHeader from '@/components/PageHeader/PageHeader'
import { Input } from '@/components/Input/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/select'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'
import { useApiMutation, useApiQuery, queryKeys, useInvalidateQueries } from '@/hooks/useApi'
import { trainerService } from '@/services'
import { useToast } from '@/hooks/useToast'
import { mapAppErrorToForm, type FormFieldErrors } from '@/utils/apiFormError'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

interface TrainerRow {
    id: string
    name: string
    email: string
    phone: string
    membersCount: number
    updatedAt: string
}

interface TrainerFormState {
    firstName: string
    lastName: string
    email: string
    phone: string
}

const initialFormState: TrainerFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
}

type TrainerFormField = 'firstName' | 'lastName' | 'email' | 'phone'

export default function TrainersList() {
    const { addToast, addActionToast } = useToast()
    const { invalidateTrainers, invalidateMembers } = useInvalidateQueries()

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState('')
    const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
    const [selectedTrainer, setSelectedTrainer] = useState<TrainerRow | null>(null)
    const [formState, setFormState] = useState<TrainerFormState>(initialFormState)
    const [formError, setFormError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<FormFieldErrors<TrainerFormField>>({})

    const trainersQuery = useApiQuery(
        queryKeys.trainers.list(page, limit, true),
        () => trainerService.list({ page, limit, includeDeleted: false, includeMembers: true }),
        {
            placeholderData: (previousData) => previousData,
        }
    )

    const createTrainerMutation = useApiMutation((payload: TrainerFormState) =>
        trainerService.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
        })
    )

    const updateTrainerMutation = useApiMutation((payload: { id: string; form: TrainerFormState }) =>
        trainerService.update(payload.id, {
            firstName: payload.form.firstName,
            lastName: payload.form.lastName,
            phone: payload.form.phone,
        })
    )

    const deleteTrainerMutation = useApiMutation((id: string) => trainerService.delete(id))

    const rows = useMemo<TrainerRow[]>(() => {
        const raw = trainersQuery.data?.data ?? []
        return raw.map((trainer) => {
            const fullName = `${trainer.firstName ?? ''} ${trainer.lastName ?? ''}`.trim() || trainer.email
            return {
                id: trainer.id,
                name: fullName,
                email: trainer.email,
                phone: trainer.phone,
                membersCount: trainer.members?.length ?? 0,
                updatedAt: new Date(trainer.updatedAt).toISOString().slice(0, 10),
            }
        })
    }, [trainersQuery.data])

    const normalizedQuery = query.trim().toLowerCase()
    const filteredRows = normalizedQuery
        ? rows.filter((trainer) =>
            trainer.name.toLowerCase().includes(normalizedQuery) ||
            trainer.email.toLowerCase().includes(normalizedQuery) ||
            trainer.phone.toLowerCase().includes(normalizedQuery)
        )
        : rows

    const openCreateForm = () => {
        setFormMode('create')
        setSelectedTrainer(null)
        setFormState(initialFormState)
        setFormError(null)
        setFieldErrors({})
    }

    const openEditForm = (trainer: TrainerRow) => {
        setFormMode('edit')
        setSelectedTrainer(trainer)
        const [firstName, ...rest] = trainer.name.split(' ')
        setFormState({
            firstName: firstName ?? '',
            lastName: rest.join(' '),
            email: trainer.email,
            phone: trainer.phone,
        })
        setFormError(null)
        setFieldErrors({})
    }

    const closeForm = () => {
        setFormMode(null)
        setSelectedTrainer(null)
        setFormState(initialFormState)
        setFormError(null)
        setFieldErrors({})
    }

    const saveTrainer = async (mode: 'create' | 'edit', payload: TrainerFormState, trainerId?: string) => {
        if (mode === 'create') {
            await createTrainerMutation.mutateAsync(payload)
            addToast('Trainer created successfully', 'success')
            return
        }

        if (!trainerId) {
            throw new Error('Missing trainer id for update')
        }

        await updateTrainerMutation.mutateAsync({ id: trainerId, form: payload })
        addToast('Trainer updated successfully', 'success')
    }

    const deleteTrainer = async (trainer: TrainerRow) => {
        await deleteTrainerMutation.mutateAsync(trainer.id)
        addToast('Trainer deleted successfully', 'success')
        invalidateTrainers()
        invalidateMembers()
    }

    const submitForm = async () => {
        const nextFieldErrors: FormFieldErrors<TrainerFormField> = {
            firstName: formState.firstName ? undefined : 'First name is required',
            lastName: formState.lastName ? undefined : 'Last name is required',
            email: formState.email ? undefined : 'Email is required',
            phone: formState.phone ? undefined : 'Phone is required',
        }

        const hasRequiredErrors = Object.values(nextFieldErrors).some(Boolean)
        if (hasRequiredErrors) {
            setFieldErrors(nextFieldErrors)
            setFormError('Please fix the highlighted fields.')
            addToast('Please fix the highlighted fields.', 'warning')
            return
        }

        setFormError(null)
        setFieldErrors({})

        try {
            const payload = { ...formState }
            const trainerId = selectedTrainer?.id
            await saveTrainer(formMode === 'create' ? 'create' : 'edit', payload, trainerId)

            closeForm()
            invalidateTrainers()
            invalidateMembers()
        } catch (error: unknown) {
            const payload = { ...formState }
            const trainerId = selectedTrainer?.id
            const mapped = mapAppErrorToForm<TrainerFormField>(error, {
                fallbackMessage: 'Failed to save trainer',
                fieldMatchers: {
                    email: /email/i,
                    phone: /phone/i,
                    firstName: /first\s*name/i,
                    lastName: /last\s*name/i,
                },
            })
            setFieldErrors(mapped.fieldErrors)
            setFormError(mapped.message)
            addActionToast(mapped.message, 'error', 'Retry', () => {
                void saveTrainer(formMode === 'create' ? 'create' : 'edit', payload, trainerId)
            })
        }
    }

    const handleDelete = async (trainer: TrainerRow) => {
        const confirmed = window.confirm(`Delete ${trainer.name}?`)
        if (!confirmed) {
            return
        }

        try {
            await deleteTrainer(trainer)
        } catch (error: unknown) {
            const mapped = mapAppErrorToForm<TrainerFormField>(error, {
                fallbackMessage: 'Failed to delete trainer',
                fieldMatchers: {
                    email: /email/i,
                    phone: /phone/i,
                    firstName: /first\s*name/i,
                    lastName: /last\s*name/i,
                },
            })
            addActionToast(mapped.message, 'error', 'Retry', () => {
                void deleteTrainer(trainer)
            })
        }
    }

    const columns: DataTableColumn<TrainerRow>[] = [
        {
            key: 'trainer',
            header: 'Trainer',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (trainer) => (
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trainer.name)}`} />
                        <AvatarFallback>{trainer.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-foreground">{trainer.name}</p>
                        <p className="text-xs text-muted-foreground">{trainer.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'phone',
            header: 'Phone',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4 text-muted-foreground',
            render: (trainer) => trainer.phone,
        },
        {
            key: 'membersCount',
            header: 'Assigned Members',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (trainer) => trainer.membersCount,
        },
        {
            key: 'updatedAt',
            header: 'Updated At',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4 text-muted-foreground',
            render: (trainer) => trainer.updatedAt,
        },
        {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (trainer) => (
                <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => openEditForm(trainer)}>
                        Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => void handleDelete(trainer)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div>
            <PageHeader title="Trainers" breadcrumb="GymHub / Trainers">
                <Button onClick={openCreateForm}>Add Trainer</Button>
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
                                className={fieldErrors.firstName ? 'border-destructive' : ''}
                            />
                            {fieldErrors.firstName ? <p className="text-xs text-destructive">{fieldErrors.firstName}</p> : null}
                            <Input
                                placeholder="Last name"
                                value={formState.lastName}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, lastName: event.target.value }))
                                }
                                className={fieldErrors.lastName ? 'border-destructive' : ''}
                            />
                            {fieldErrors.lastName ? <p className="text-xs text-destructive">{fieldErrors.lastName}</p> : null}
                            <Input
                                placeholder="Email"
                                type="email"
                                value={formState.email}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, email: event.target.value }))
                                }
                                disabled={formMode === 'edit'}
                                className={fieldErrors.email ? 'border-destructive' : ''}
                            />
                            {fieldErrors.email ? <p className="text-xs text-destructive">{fieldErrors.email}</p> : null}
                            <Input
                                placeholder="Phone"
                                value={formState.phone}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, phone: event.target.value }))
                                }
                                className={fieldErrors.phone ? 'border-destructive' : ''}
                            />
                            {fieldErrors.phone ? <p className="text-xs text-destructive">{fieldErrors.phone}</p> : null}
                        </div>
                        {formError ? <p className="mt-3 text-sm text-destructive">{formError}</p> : null}
                        <div className="mt-3 flex justify-end gap-2">
                            <Button variant="outline" onClick={closeForm}>Cancel</Button>
                            <Button
                                onClick={() => void submitForm()}
                                disabled={createTrainerMutation.isPending || updateTrainerMutation.isPending}
                            >
                                {formMode === 'create' ? 'Create Trainer' : 'Update Trainer'}
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
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                    <Select
                        value={String(limit)}
                        onValueChange={(value) => {
                            setLimit(Number(value))
                            setPage(1)
                        }}
                    >
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <SelectItem key={size} value={String(size)}>{size}/page</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Trainer List</CardTitle>
                    <CardDescription>{trainersQuery.data?.total ?? 0} records</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {trainersQuery.isLoading ? (
                        <div className="py-10">
                            <LoadingSpinner />
                        </div>
                    ) : trainersQuery.error ? (
                        <div className="p-4">
                            <ErrorState
                                message={trainersQuery.error.userMessage}
                                onRetry={() => void trainersQuery.refetch()}
                            />
                        </div>
                    ) : (
                        <>
                            <DataTable
                                data={filteredRows}
                                columns={columns}
                                getRowKey={(trainer) => trainer.id}
                                rowClassName="hover:bg-muted/30 transition-colors"
                                emptyMessage="No trainers found."
                            />
                            <div className="flex items-center justify-between p-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Page {page} of {Math.max(trainersQuery.data?.totalPages ?? 1, 1)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={page <= 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setPage((prev) => Math.min(prev + 1, Math.max(trainersQuery.data?.totalPages ?? 1, 1)))
                                        }
                                        disabled={page >= Math.max(trainersQuery.data?.totalPages ?? 1, 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

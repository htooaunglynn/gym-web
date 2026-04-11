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
import { userService } from '@/services'
import { mapAppErrorToForm, type FormFieldErrors } from '@/utils/apiFormError'
import { useToast } from '@/hooks/useToast'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

type UserRole = 'ADMIN' | 'STAFF' | 'HR'

interface UserRow {
    id: string
    name: string
    email: string
    phone: string
    role: UserRole
    updatedAt: string
}

interface UserFormState {
    firstName: string
    lastName: string
    email: string
    phone: string
    role: UserRole
    password: string
}

const initialFormState: UserFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'STAFF',
    password: '',
}

type UserFormField = 'firstName' | 'lastName' | 'email' | 'phone' | 'role' | 'password'

export default function UsersList() {
    const { addToast, addActionToast } = useToast()
    const { invalidateUsers } = useInvalidateQueries()

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [query, setQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')
    const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)
    const [formState, setFormState] = useState<UserFormState>(initialFormState)
    const [formError, setFormError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<FormFieldErrors<UserFormField>>({})

    const usersQuery = useApiQuery(
        queryKeys.users.list(page, limit),
        () => userService.list({ page, limit, includeDeleted: false }),
        {
            placeholderData: (previousData) => previousData,
        }
    )

    const createUserMutation = useApiMutation((payload: UserFormState) =>
        userService.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            role: payload.role,
            password: payload.password,
        })
    )

    const updateUserMutation = useApiMutation((payload: { id: string; form: UserFormState }) =>
        userService.update(payload.id, {
            firstName: payload.form.firstName,
            lastName: payload.form.lastName,
            phone: payload.form.phone,
            role: payload.form.role,
        })
    )

    const deleteUserMutation = useApiMutation((id: string) => userService.delete(id))

    const rows = useMemo<UserRow[]>(() => {
        const raw = usersQuery.data?.data ?? []
        return raw.map((user) => {
            const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email
            return {
                id: user.id,
                name: fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                updatedAt: new Date(user.updatedAt).toISOString().slice(0, 10),
            }
        })
    }, [usersQuery.data])

    const normalizedQuery = query.trim().toLowerCase()
    const filteredRows = rows.filter((user) => {
        const matchesQuery =
            normalizedQuery.length === 0 ||
            user.name.toLowerCase().includes(normalizedQuery) ||
            user.email.toLowerCase().includes(normalizedQuery) ||
            user.phone.toLowerCase().includes(normalizedQuery)
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesQuery && matchesRole
    })

    const openCreateForm = () => {
        setFormMode('create')
        setSelectedUser(null)
        setFormState(initialFormState)
        setFormError(null)
        setFieldErrors({})
    }

    const openEditForm = (user: UserRow) => {
        setFormMode('edit')
        setSelectedUser(user)
        const [firstName, ...rest] = user.name.split(' ')
        setFormState({
            firstName: firstName ?? '',
            lastName: rest.join(' '),
            email: user.email,
            phone: user.phone,
            role: user.role,
            password: '',
        })
        setFormError(null)
        setFieldErrors({})
    }

    const closeForm = () => {
        setFormMode(null)
        setSelectedUser(null)
        setFormState(initialFormState)
        setFormError(null)
        setFieldErrors({})
    }

    const saveUser = async (mode: 'create' | 'edit', payload: UserFormState, userId?: string) => {
        if (mode === 'create') {
            await createUserMutation.mutateAsync(payload)
            addToast('User created successfully', 'success')
            return
        }

        if (!userId) {
            throw new Error('Missing user id for update')
        }

        await updateUserMutation.mutateAsync({ id: userId, form: payload })
        addToast('User updated successfully', 'success')
    }

    const deleteUser = async (user: UserRow) => {
        await deleteUserMutation.mutateAsync(user.id)
        addToast('User deleted successfully', 'success')
        invalidateUsers()
    }

    const submitForm = async () => {
        const nextFieldErrors: FormFieldErrors<UserFormField> = {
            firstName: formState.firstName ? undefined : 'First name is required',
            lastName: formState.lastName ? undefined : 'Last name is required',
            email: formState.email ? undefined : 'Email is required',
            phone: formState.phone ? undefined : 'Phone is required',
            role: formState.role ? undefined : 'Role is required',
            password: formMode === 'create' && !formState.password ? 'Password is required' : undefined,
        }

        const hasRequiredErrors = Object.values(nextFieldErrors).some(Boolean)
        if (hasRequiredErrors) {
            setFieldErrors(nextFieldErrors)
            setFormError('Please fix the highlighted fields.')
            return
        }

        setFormError(null)
        setFieldErrors({})

        try {
            const payload = { ...formState }
            const userId = selectedUser?.id
            await saveUser(formMode === 'create' ? 'create' : 'edit', payload, userId)

            closeForm()
            invalidateUsers()
        } catch (error: unknown) {
            const payload = { ...formState }
            const userId = selectedUser?.id
            const mapped = mapAppErrorToForm<UserFormField>(error, {
                fallbackMessage: 'Failed to save user',
                fieldMatchers: {
                    email: /email/i,
                    phone: /phone/i,
                    firstName: /first\s*name/i,
                    lastName: /last\s*name/i,
                    role: /role/i,
                    password: /password/i,
                },
            })
            setFieldErrors(mapped.fieldErrors)
            setFormError(mapped.message)
            addActionToast(mapped.message, 'error', 'Retry', () => {
                void saveUser(formMode === 'create' ? 'create' : 'edit', payload, userId)
            })
        }
    }

    const handleDelete = async (user: UserRow) => {
        const confirmed = window.confirm(`Delete ${user.name}?`)
        if (!confirmed) {
            return
        }

        try {
            await deleteUser(user)
        } catch (error: unknown) {
            const mapped = mapAppErrorToForm<UserFormField>(error, {
                fallbackMessage: 'Failed to delete user',
                fieldMatchers: {
                    email: /email/i,
                    phone: /phone/i,
                    firstName: /first\s*name/i,
                    lastName: /last\s*name/i,
                    role: /role/i,
                    password: /password/i,
                },
            })
            setFormError(mapped.message)
            addActionToast(mapped.message, 'error', 'Retry', () => {
                void deleteUser(user)
            })
        }
    }

    const columns: DataTableColumn<UserRow>[] = [
        {
            key: 'user',
            header: 'User',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'phone',
            header: 'Phone',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4 text-muted-foreground',
            render: (user) => user.phone,
        },
        {
            key: 'role',
            header: 'Role',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (user) => user.role,
        },
        {
            key: 'updatedAt',
            header: 'Updated At',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4 text-muted-foreground',
            render: (user) => user.updatedAt,
        },
        {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (user) => (
                <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                    <Button size="sm" variant="outline" onClick={() => openEditForm(user)}>
                        Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => void handleDelete(user)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div>
            <PageHeader title="Staff Management" breadcrumb="GymHub / Staff Management">
                <Button onClick={openCreateForm}>Add User</Button>
            </PageHeader>

            {formMode ? (
                <Card className="mb-4">
                    <CardContent className="p-4 space-y-3">
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
                            <Select
                                value={formState.role}
                                onValueChange={(value: UserRole) =>
                                    setFormState((prev) => ({ ...prev, role: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                    <SelectItem value="STAFF">STAFF</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldErrors.role ? <p className="text-xs text-destructive">{fieldErrors.role}</p> : null}
                            {formMode === 'create' ? (
                                <>
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        value={formState.password}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, password: event.target.value }))
                                        }
                                        className={fieldErrors.password ? 'border-destructive' : ''}
                                    />
                                    {fieldErrors.password ? <p className="text-xs text-destructive">{fieldErrors.password}</p> : null}
                                </>
                            ) : null}
                        </div>

                        {formError ? (
                            <p className="text-sm text-destructive">{formError}</p>
                        ) : null}

                        <div className="mt-3 flex justify-end gap-2">
                            <Button variant="outline" onClick={closeForm}>Cancel</Button>
                            <Button
                                onClick={() => void submitForm()}
                                disabled={createUserMutation.isPending || updateUserMutation.isPending}
                            >
                                {formMode === 'create' ? 'Create User' : 'Update User'}
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
                    <div className="flex gap-3">
                        <Select
                            value={roleFilter}
                            onValueChange={(value: 'all' | UserRole) => {
                                setRoleFilter(value)
                                setPage(1)
                            }}
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                <SelectItem value="STAFF">STAFF</SelectItem>
                                <SelectItem value="HR">HR</SelectItem>
                            </SelectContent>
                        </Select>
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
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Staff Users</CardTitle>
                    <CardDescription>{usersQuery.data?.total ?? 0} records</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {usersQuery.isLoading ? (
                        <div className="py-10">
                            <LoadingSpinner />
                        </div>
                    ) : usersQuery.error ? (
                        <div className="p-4">
                            <ErrorState
                                message={usersQuery.error.userMessage}
                                onRetry={() => void usersQuery.refetch()}
                            />
                        </div>
                    ) : (
                        <>
                            <DataTable
                                data={filteredRows}
                                columns={columns}
                                getRowKey={(user) => user.id}
                                rowClassName="hover:bg-muted/30 transition-colors"
                                emptyMessage="No users found."
                            />
                            <div className="flex items-center justify-between p-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Page {page} of {Math.max(usersQuery.data?.totalPages ?? 1, 1)}
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
                                            setPage((prev) => Math.min(prev + 1, Math.max(usersQuery.data?.totalPages ?? 1, 1)))
                                        }
                                        disabled={page >= Math.max(usersQuery.data?.totalPages ?? 1, 1)}
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

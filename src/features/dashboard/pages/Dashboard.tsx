import { useMemo, useState } from 'react'
import {
    ArrowDownLeft,
    ArrowUpRight,
    Boxes,
    Users,
} from 'lucide-react'
import PageHeader from '@/components/PageHeader/PageHeader'
import StatCard from '@/components/StatCard/StatCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import { ErrorState } from '@/components/shared/ErrorState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApiQuery, queryKeys } from '@/hooks/useApi'
import { equipmentService, inventoryService, memberService, paymentService } from '@/services'
import { DashboardTableSection } from '@/features/dashboard/components/DashboardTableSection'
import { DashboardDateRangeFilter } from '@/features/dashboard/components/DashboardDateRangeFilter'

type MemberRow = {
    id: string
    name: string
    email: string
    avatar: string
    status: 'Active' | 'Inactive'
    joinDate: string
}

type EquipmentRow = {
    id: string
    name: string
    quantity: number
    condition: 'GOOD' | 'FAIR' | 'POOR'
    managedBy: string
    updatedAt: string
}

type InventoryRow = {
    id: string
    equipmentId: string
    quantity: number
    reason: string
    occurredAt: string
}

type PaymentRow = {
    id: string
    memberName: string
    amount: number
    status: 'Paid' | 'Pending' | 'Overdue'
    method: 'Credit Card' | 'Bank Transfer' | 'Cash'
    date: string
}

type DatePreset = 'today' | '7d' | '30d' | 'custom'

function formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`
}

function formatInputDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function getPresetDateRange(preset: Exclude<DatePreset, 'custom'>): { from: string; to: string } {
    const today = new Date()
    const start = new Date(today)

    if (preset === '7d') {
        start.setDate(today.getDate() - 6)
    }

    if (preset === '30d') {
        start.setDate(today.getDate() - 29)
    }

    return {
        from: formatInputDate(start),
        to: formatInputDate(today),
    }
}

function toApiDateStart(date: string | undefined): string | undefined {
    if (!date) {
        return undefined
    }

    return `${date}T00:00:00.000Z`
}

function toApiDateEnd(date: string | undefined): string | undefined {
    if (!date) {
        return undefined
    }

    return `${date}T23:59:59.999Z`
}

function PaginationControls({
    page,
    totalPages,
    onPrevious,
    onNext,
}: {
    page: number
    totalPages: number
    onPrevious: () => void
    onNext: () => void
}) {
    return (
        <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
                Page {page} of {Math.max(totalPages, 1)}
            </p>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onPrevious} disabled={page <= 1}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={onNext} disabled={page >= Math.max(totalPages, 1)}>
                    Next
                </Button>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const tableLimit = 10
    const paymentsFetchLimit = 200
    const defaultRange = getPresetDateRange('7d')

    const [membersPage, setMembersPage] = useState(1)
    const [equipmentPage, setEquipmentPage] = useState(1)
    const [incomingInventoryPage, setIncomingInventoryPage] = useState(1)
    const [outgoingInventoryPage, setOutgoingInventoryPage] = useState(1)
    const [incomingPaymentsPage, setIncomingPaymentsPage] = useState(1)
    const [outgoingPaymentsPage, setOutgoingPaymentsPage] = useState(1)
    const [memberSearch, setMemberSearch] = useState('')
    const [memberStatusFilter, setMemberStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all')
    const [equipmentSearch, setEquipmentSearch] = useState('')
    const [equipmentConditionFilter, setEquipmentConditionFilter] = useState<'all' | 'GOOD' | 'FAIR' | 'POOR'>('all')
    const [incomingInventorySearch, setIncomingInventorySearch] = useState('')
    const [outgoingInventorySearch, setOutgoingInventorySearch] = useState('')
    const [incomingMethodFilter, setIncomingMethodFilter] = useState<'all' | 'Credit Card' | 'Bank Transfer' | 'Cash'>('all')
    const [outgoingMethodFilter, setOutgoingMethodFilter] = useState<'all' | 'Credit Card' | 'Bank Transfer' | 'Cash'>('all')
    const [outgoingStatusFilter, setOutgoingStatusFilter] = useState<'uncollected' | 'Pending' | 'Overdue'>('uncollected')
    const [inventoryDatePreset, setInventoryDatePreset] = useState<DatePreset>('7d')
    const [inventoryDateFrom, setInventoryDateFrom] = useState(defaultRange.from)
    const [inventoryDateTo, setInventoryDateTo] = useState(defaultRange.to)
    const [paymentDatePreset, setPaymentDatePreset] = useState<DatePreset>('7d')
    const [paymentDateFrom, setPaymentDateFrom] = useState(defaultRange.from)
    const [paymentDateTo, setPaymentDateTo] = useState(defaultRange.to)

    const inventoryDateFromApi = inventoryDatePreset === 'custom'
        ? toApiDateStart(inventoryDateFrom)
        : toApiDateStart(getPresetDateRange(inventoryDatePreset as Exclude<DatePreset, 'custom'>).from)
    const inventoryDateToApi = inventoryDatePreset === 'custom'
        ? toApiDateEnd(inventoryDateTo)
        : toApiDateEnd(getPresetDateRange(inventoryDatePreset as Exclude<DatePreset, 'custom'>).to)

    const paymentDateFromApi = paymentDatePreset === 'custom'
        ? toApiDateStart(paymentDateFrom)
        : toApiDateStart(getPresetDateRange(paymentDatePreset as Exclude<DatePreset, 'custom'>).from)
    const paymentDateToApi = paymentDatePreset === 'custom'
        ? toApiDateEnd(paymentDateTo)
        : toApiDateEnd(getPresetDateRange(paymentDatePreset as Exclude<DatePreset, 'custom'>).to)

    const membersQuery = useApiQuery(
        queryKeys.members.list(membersPage, tableLimit),
        () => memberService.list({ page: membersPage, limit: tableLimit, includeDeleted: true }),
        { placeholderData: (previousData) => previousData }
    )

    const equipmentQuery = useApiQuery(
        queryKeys.equipment.list(equipmentPage, tableLimit),
        () => equipmentService.list({ page: equipmentPage, limit: tableLimit, includeDeleted: false }),
        { placeholderData: (previousData) => previousData }
    )

    const incomingInventoryQuery = useApiQuery(
        queryKeys.inventory.list({ page: incomingInventoryPage, limit: tableLimit, movementType: 'INCOMING', dateFrom: inventoryDateFromApi, dateTo: inventoryDateToApi }),
        () =>
            inventoryService.list({
                page: incomingInventoryPage,
                limit: tableLimit,
                includeDeleted: false,
                movementType: 'INCOMING',
                dateFrom: inventoryDateFromApi,
                dateTo: inventoryDateToApi,
            }),
        { placeholderData: (previousData) => previousData }
    )

    const outgoingInventoryQuery = useApiQuery(
        queryKeys.inventory.list({ page: outgoingInventoryPage, limit: tableLimit, movementType: 'OUTGOING', dateFrom: inventoryDateFromApi, dateTo: inventoryDateToApi }),
        () =>
            inventoryService.list({
                page: outgoingInventoryPage,
                limit: tableLimit,
                includeDeleted: false,
                movementType: 'OUTGOING',
                dateFrom: inventoryDateFromApi,
                dateTo: inventoryDateToApi,
            }),
        { placeholderData: (previousData) => previousData }
    )

    const incomingPaymentsQuery = useApiQuery(
        queryKeys.payments.list({ page: 1, limit: paymentsFetchLimit, status: 'Paid', dateFrom: paymentDateFromApi, dateTo: paymentDateToApi }),
        () =>
            paymentService.list({
                page: 1,
                limit: paymentsFetchLimit,
                status: 'Paid',
                dateFrom: paymentDateFromApi,
                dateTo: paymentDateToApi,
            }),
        { placeholderData: (previousData) => previousData }
    )

    const pendingPaymentsQuery = useApiQuery(
        queryKeys.payments.list({ page: 1, limit: paymentsFetchLimit, status: 'Pending', dateFrom: paymentDateFromApi, dateTo: paymentDateToApi }),
        () =>
            paymentService.list({
                page: 1,
                limit: paymentsFetchLimit,
                status: 'Pending',
                dateFrom: paymentDateFromApi,
                dateTo: paymentDateToApi,
            }),
        { placeholderData: (previousData) => previousData }
    )

    const overduePaymentsQuery = useApiQuery(
        queryKeys.payments.list({ page: 1, limit: paymentsFetchLimit, status: 'Overdue', dateFrom: paymentDateFromApi, dateTo: paymentDateToApi }),
        () =>
            paymentService.list({
                page: 1,
                limit: paymentsFetchLimit,
                status: 'Overdue',
                dateFrom: paymentDateFromApi,
                dateTo: paymentDateToApi,
            }),
        { placeholderData: (previousData) => previousData }
    )

    const members: MemberRow[] = (membersQuery.data?.data ?? []).map((member) => {
        const name = `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim() || member.email
        return {
            id: member.id,
            name,
            email: member.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
            status: member.deletedAt ? 'Inactive' : 'Active',
            joinDate: new Date(member.createdAt).toISOString().slice(0, 10),
        }
    })

    const equipment: EquipmentRow[] = (equipmentQuery.data?.data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        condition: item.condition,
        managedBy: item.managedByUserId,
        updatedAt: new Date(item.updatedAt).toISOString().slice(0, 10),
    }))

    const incomingInventory: InventoryRow[] = (incomingInventoryQuery.data?.data ?? []).map((item) => ({
        id: item.id,
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        reason: item.reason,
        occurredAt: new Date(item.occurredAt).toISOString().slice(0, 10),
    }))

    const outgoingInventory: InventoryRow[] = (outgoingInventoryQuery.data?.data ?? []).map((item) => ({
        id: item.id,
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        reason: item.reason,
        occurredAt: new Date(item.occurredAt).toISOString().slice(0, 10),
    }))

    const incomingPaymentsRaw: PaymentRow[] = (incomingPaymentsQuery.data?.data ?? []).map((payment) => ({
        id: payment.id,
        memberName: payment.memberName,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        date: payment.date,
    }))

    const pendingPayments: PaymentRow[] = (pendingPaymentsQuery.data?.data ?? []).map((payment) => ({
        id: payment.id,
        memberName: payment.memberName,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        date: payment.date,
    }))

    const overduePayments: PaymentRow[] = (overduePaymentsQuery.data?.data ?? []).map((payment) => ({
        id: payment.id,
        memberName: payment.memberName,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        date: payment.date,
    }))

    const outgoingPaymentsRaw = useMemo(() => {
        if (outgoingStatusFilter === 'Pending') {
            return pendingPayments
        }

        if (outgoingStatusFilter === 'Overdue') {
            return overduePayments
        }

        return [...pendingPayments, ...overduePayments]
    }, [outgoingStatusFilter, pendingPayments, overduePayments])

    const filteredMembers = useMemo(() => {
        const normalized = memberSearch.trim().toLowerCase()
        return members.filter((member) => {
            const matchesSearch =
                normalized.length === 0 ||
                member.name.toLowerCase().includes(normalized) ||
                member.email.toLowerCase().includes(normalized)
            const matchesStatus = memberStatusFilter === 'all' || member.status === memberStatusFilter
            return matchesSearch && matchesStatus
        })
    }, [members, memberSearch, memberStatusFilter])

    const filteredEquipment = useMemo(() => {
        const normalized = equipmentSearch.trim().toLowerCase()
        return equipment.filter((item) => {
            const matchesSearch =
                normalized.length === 0 ||
                item.name.toLowerCase().includes(normalized) ||
                item.managedBy.toLowerCase().includes(normalized)
            const matchesCondition = equipmentConditionFilter === 'all' || item.condition === equipmentConditionFilter
            return matchesSearch && matchesCondition
        })
    }, [equipment, equipmentSearch, equipmentConditionFilter])

    const filteredIncomingInventory = useMemo(() => {
        const normalized = incomingInventorySearch.trim().toLowerCase()
        return incomingInventory.filter((item) =>
            normalized.length === 0 ||
            item.equipmentId.toLowerCase().includes(normalized) ||
            item.reason.toLowerCase().includes(normalized)
        )
    }, [incomingInventory, incomingInventorySearch])

    const filteredOutgoingInventory = useMemo(() => {
        const normalized = outgoingInventorySearch.trim().toLowerCase()
        return outgoingInventory.filter((item) =>
            normalized.length === 0 ||
            item.equipmentId.toLowerCase().includes(normalized) ||
            item.reason.toLowerCase().includes(normalized)
        )
    }, [outgoingInventory, outgoingInventorySearch])

    const filteredIncomingPayments = useMemo(() => {
        const normalized = ''
        return incomingPaymentsRaw.filter((payment) => {
            const matchesMethod = incomingMethodFilter === 'all' || payment.method === incomingMethodFilter
            const matchesSearch =
                normalized.length === 0 ||
                payment.memberName.toLowerCase().includes(normalized) ||
                payment.method.toLowerCase().includes(normalized)
            return matchesMethod && matchesSearch
        })
    }, [incomingPaymentsRaw, incomingMethodFilter])

    const filteredOutgoingPayments = useMemo(() => {
        const normalized = ''
        return outgoingPaymentsRaw.filter((payment) => {
            const matchesMethod = outgoingMethodFilter === 'all' || payment.method === outgoingMethodFilter
            const matchesSearch =
                normalized.length === 0 ||
                payment.memberName.toLowerCase().includes(normalized) ||
                payment.method.toLowerCase().includes(normalized)
            return matchesMethod && matchesSearch
        })
    }, [outgoingPaymentsRaw, outgoingMethodFilter])

    const incomingPaymentsTotalPages = Math.max(Math.ceil(filteredIncomingPayments.length / tableLimit), 1)
    const outgoingPaymentsTotalPages = Math.max(Math.ceil(filteredOutgoingPayments.length / tableLimit), 1)

    const incomingPayments = filteredIncomingPayments.slice((incomingPaymentsPage - 1) * tableLimit, incomingPaymentsPage * tableLimit)
    const outgoingPayments = filteredOutgoingPayments.slice((outgoingPaymentsPage - 1) * tableLimit, outgoingPaymentsPage * tableLimit)

    const incomingInventoryQuantity = filteredIncomingInventory.reduce((sum, item) => sum + item.quantity, 0)
    const outgoingInventoryQuantity = filteredOutgoingInventory.reduce((sum, item) => sum + item.quantity, 0)
    const incomingPaymentsTotal = filteredIncomingPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const outgoingPaymentsTotal = filteredOutgoingPayments.reduce((sum, payment) => sum + payment.amount, 0)

    const memberColumns: DataTableColumn<MemberRow>[] = [
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

    const equipmentColumns: DataTableColumn<EquipmentRow>[] = [
        { key: 'name', header: 'Equipment', cellClassName: 'py-3', render: (item) => item.name },
        { key: 'quantity', header: 'Quantity', cellClassName: 'py-3', render: (item) => item.quantity },
        {
            key: 'condition',
            header: 'Condition',
            cellClassName: 'py-3',
            render: (item) => <StatusBadge kind="equipment-condition" value={item.condition} />,
        },
        {
            key: 'updatedAt',
            header: 'Updated At',
            cellClassName: 'py-3 text-muted-foreground',
            render: (item) => item.updatedAt,
        },
    ]

    const inventoryColumns: DataTableColumn<InventoryRow>[] = [
        { key: 'equipmentId', header: 'Equipment ID', cellClassName: 'py-3', render: (item) => item.equipmentId },
        { key: 'quantity', header: 'Quantity', cellClassName: 'py-3', render: (item) => item.quantity },
        { key: 'reason', header: 'Reason', cellClassName: 'py-3', render: (item) => item.reason },
        {
            key: 'occurredAt',
            header: 'Occurred At',
            cellClassName: 'py-3 text-muted-foreground',
            render: (item) => item.occurredAt,
        },
    ]

    const paymentColumns: DataTableColumn<PaymentRow>[] = [
        { key: 'memberName', header: 'Member', cellClassName: 'py-3', render: (payment) => payment.memberName },
        {
            key: 'amount',
            header: 'Amount',
            cellClassName: 'py-3 font-medium',
            render: (payment) => formatCurrency(payment.amount),
        },
        {
            key: 'status',
            header: 'Status',
            cellClassName: 'py-3',
            render: (payment) => <StatusBadge kind="payment-status" value={payment.status} />,
        },
        {
            key: 'method',
            header: 'Method',
            cellClassName: 'py-3 text-muted-foreground',
            render: (payment) => payment.method,
        },
    ]

    return (
        <div>
            <PageHeader title="Admin Dashboard" breadcrumb="GymHub / Admin Dashboard" />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                <DashboardDateRangeFilter
                    title="Inventory Date Range"
                    description="Apply to incoming and outgoing inventory sections"
                    preset={inventoryDatePreset}
                    from={inventoryDateFrom}
                    to={inventoryDateTo}
                    onPresetChange={(value) => {
                        setInventoryDatePreset(value)
                        setIncomingInventoryPage(1)
                        setOutgoingInventoryPage(1)
                        if (value !== 'custom') {
                            const next = getPresetDateRange(value)
                            setInventoryDateFrom(next.from)
                            setInventoryDateTo(next.to)
                        }
                    }}
                    onFromChange={(value) => {
                        setInventoryDateFrom(value)
                        setIncomingInventoryPage(1)
                        setOutgoingInventoryPage(1)
                    }}
                    onToChange={(value) => {
                        setInventoryDateTo(value)
                        setIncomingInventoryPage(1)
                        setOutgoingInventoryPage(1)
                    }}
                />

                <DashboardDateRangeFilter
                    title="Payments Date Range"
                    description="Apply to incoming and uncollected payment sections"
                    preset={paymentDatePreset}
                    from={paymentDateFrom}
                    to={paymentDateTo}
                    onPresetChange={(value) => {
                        setPaymentDatePreset(value)
                        setIncomingPaymentsPage(1)
                        setOutgoingPaymentsPage(1)
                        if (value !== 'custom') {
                            const next = getPresetDateRange(value)
                            setPaymentDateFrom(next.from)
                            setPaymentDateTo(next.to)
                        }
                    }}
                    onFromChange={(value) => {
                        setPaymentDateFrom(value)
                        setIncomingPaymentsPage(1)
                        setOutgoingPaymentsPage(1)
                    }}
                    onToChange={(value) => {
                        setPaymentDateTo(value)
                        setIncomingPaymentsPage(1)
                        setOutgoingPaymentsPage(1)
                    }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Incoming Inventory"
                    value={incomingInventoryQuantity}
                    delta={`${incomingInventoryQuery.data?.total ?? 0} records`}
                    icon={Users}
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-600"
                />
                <StatCard
                    title="Outgoing Inventory"
                    value={outgoingInventoryQuantity}
                    delta={`${outgoingInventoryQuery.data?.total ?? 0} records`}
                    icon={Boxes}
                    iconBg="bg-cyan-100"
                    iconColor="text-cyan-600"
                />
                <StatCard
                    title="Incoming Payments"
                    value={formatCurrency(incomingPaymentsTotal)}
                    delta={`${filteredIncomingPayments.length} paid records`}
                    icon={ArrowDownLeft}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                />
                <StatCard
                    title="Uncollected Payments"
                    value={formatCurrency(outgoingPaymentsTotal)}
                    delta={`${filteredOutgoingPayments.length} records`}
                    icon={ArrowUpRight}
                    iconBg="bg-violet-100"
                    iconColor="text-violet-600"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <DashboardTableSection
                    title="Incoming Inventory"
                    description="Latest incoming stock movements"
                    cardClassName="xl:col-span-7"
                    controls={(
                        <div className="p-3 border-b">
                            <Input
                                placeholder="Search by equipment ID or reason"
                                value={incomingInventorySearch}
                                onChange={(event) => setIncomingInventorySearch(event.target.value)}
                            />
                        </div>
                    )}
                    isLoading={incomingInventoryQuery.isLoading}
                    errorMessage={incomingInventoryQuery.error?.userMessage}
                    data={filteredIncomingInventory}
                    columns={inventoryColumns}
                    getRowKey={(item) => item.id}
                    emptyMessage="No incoming inventory records found."
                    page={incomingInventoryPage}
                    totalPages={incomingInventoryQuery.data?.totalPages ?? 1}
                    onPrevious={() => setIncomingInventoryPage((prev) => Math.max(prev - 1, 1))}
                    onNext={() =>
                        setIncomingInventoryPage((prev) =>
                            Math.min(prev + 1, Math.max(incomingInventoryQuery.data?.totalPages ?? 1, 1))
                        )
                    }
                />

                <DashboardTableSection
                    title="Outgoing Inventory"
                    description="Latest outgoing stock movements"
                    cardClassName="xl:col-span-5"
                    controls={(
                        <div className="p-3 border-b">
                            <Input
                                placeholder="Search by equipment ID or reason"
                                value={outgoingInventorySearch}
                                onChange={(event) => setOutgoingInventorySearch(event.target.value)}
                            />
                        </div>
                    )}
                    isLoading={outgoingInventoryQuery.isLoading}
                    errorMessage={outgoingInventoryQuery.error?.userMessage}
                    data={filteredOutgoingInventory}
                    columns={inventoryColumns}
                    getRowKey={(item) => item.id}
                    emptyMessage="No outgoing inventory records found."
                    page={outgoingInventoryPage}
                    totalPages={outgoingInventoryQuery.data?.totalPages ?? 1}
                    onPrevious={() => setOutgoingInventoryPage((prev) => Math.max(prev - 1, 1))}
                    onNext={() =>
                        setOutgoingInventoryPage((prev) =>
                            Math.min(prev + 1, Math.max(outgoingInventoryQuery.data?.totalPages ?? 1, 1))
                        )
                    }
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <DashboardTableSection
                    title="Incoming Payments"
                    description="Paid payment records"
                    cardClassName="xl:col-span-7"
                    controls={(
                        <div className="p-3 border-b">
                            <Select
                                value={incomingMethodFilter}
                                onValueChange={(value) => {
                                    if (value === 'all' || value === 'Credit Card' || value === 'Bank Transfer' || value === 'Cash') {
                                        setIncomingMethodFilter(value)
                                        setIncomingPaymentsPage(1)
                                    }
                                }}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Payment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Methods</SelectItem>
                                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    isLoading={incomingPaymentsQuery.isLoading}
                    errorMessage={incomingPaymentsQuery.error?.userMessage}
                    data={incomingPayments}
                    columns={paymentColumns}
                    getRowKey={(item) => item.id}
                    emptyMessage="No incoming payment records found."
                    page={incomingPaymentsPage}
                    totalPages={incomingPaymentsTotalPages}
                    onPrevious={() => setIncomingPaymentsPage((prev) => Math.max(prev - 1, 1))}
                    onNext={() =>
                        setIncomingPaymentsPage((prev) =>
                            Math.min(prev + 1, incomingPaymentsTotalPages)
                        )
                    }
                />

                <DashboardTableSection
                    title="Uncollected Payments"
                    description="Pending and overdue payment records"
                    cardClassName="xl:col-span-5"
                    controls={(
                        <div className="p-3 border-b flex flex-col sm:flex-row gap-2 sm:items-center">
                            <Select
                                value={outgoingStatusFilter}
                                onValueChange={(value) => {
                                    if (value === 'uncollected' || value === 'Pending' || value === 'Overdue') {
                                        setOutgoingStatusFilter(value)
                                        setOutgoingPaymentsPage(1)
                                    }
                                }}
                            >
                                <SelectTrigger className="w-52">
                                    <SelectValue placeholder="Outgoing Definition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="uncollected">Uncollected (Pending + Overdue)</SelectItem>
                                    <SelectItem value="Pending">Pending Only</SelectItem>
                                    <SelectItem value="Overdue">Overdue Only</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={outgoingMethodFilter}
                                onValueChange={(value) => {
                                    if (value === 'all' || value === 'Credit Card' || value === 'Bank Transfer' || value === 'Cash') {
                                        setOutgoingMethodFilter(value)
                                        setOutgoingPaymentsPage(1)
                                    }
                                }}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Payment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Methods</SelectItem>
                                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    isLoading={pendingPaymentsQuery.isLoading || overduePaymentsQuery.isLoading}
                    errorMessage={pendingPaymentsQuery.error?.userMessage ?? overduePaymentsQuery.error?.userMessage}
                    data={outgoingPayments}
                    columns={paymentColumns}
                    getRowKey={(item) => item.id}
                    emptyMessage="No outgoing payment records found."
                    page={outgoingPaymentsPage}
                    totalPages={outgoingPaymentsTotalPages}
                    onPrevious={() => setOutgoingPaymentsPage((prev) => Math.max(prev - 1, 1))}
                    onNext={() =>
                        setOutgoingPaymentsPage((prev) =>
                            Math.min(prev + 1, outgoingPaymentsTotalPages)
                        )
                    }
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <Card className="xl:col-span-8">
                    <CardHeader>
                        <CardTitle>Members List</CardTitle>
                        <CardDescription>API-driven members table</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {membersQuery.isLoading ? (
                            <div className="py-10"><LoadingSpinner /></div>
                        ) : membersQuery.error ? (
                            <div className="p-4"><ErrorState message={membersQuery.error.userMessage} /></div>
                        ) : (
                            <>
                                <div className="p-3 border-b flex flex-col sm:flex-row gap-2 sm:items-center">
                                    <Input
                                        placeholder="Search member name or email"
                                        value={memberSearch}
                                        onChange={(event) => setMemberSearch(event.target.value)}
                                    />
                                    <Select
                                        value={memberStatusFilter}
                                        onValueChange={(value) => {
                                            if (value === 'all' || value === 'Active' || value === 'Inactive') {
                                                setMemberStatusFilter(value)
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-44">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DataTable
                                    data={filteredMembers}
                                    columns={memberColumns}
                                    getRowKey={(member) => member.id}
                                />
                                <PaginationControls
                                    page={membersPage}
                                    totalPages={membersQuery.data?.totalPages ?? 1}
                                    onPrevious={() => setMembersPage((prev) => Math.max(prev - 1, 1))}
                                    onNext={() =>
                                        setMembersPage((prev) =>
                                            Math.min(prev + 1, Math.max(membersQuery.data?.totalPages ?? 1, 1))
                                        )
                                    }
                                />
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="xl:col-span-4">
                    <CardHeader>
                        <CardTitle>Equipment List</CardTitle>
                        <CardDescription>API-driven equipment table</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {equipmentQuery.isLoading ? (
                            <div className="py-10"><LoadingSpinner /></div>
                        ) : equipmentQuery.error ? (
                            <div className="p-4"><ErrorState message={equipmentQuery.error.userMessage} /></div>
                        ) : (
                            <>
                                <div className="p-3 border-b flex flex-col gap-2">
                                    <Input
                                        placeholder="Search equipment name or manager"
                                        value={equipmentSearch}
                                        onChange={(event) => setEquipmentSearch(event.target.value)}
                                    />
                                    <Select
                                        value={equipmentConditionFilter}
                                        onValueChange={(value) => {
                                            if (value === 'all' || value === 'GOOD' || value === 'FAIR' || value === 'POOR') {
                                                setEquipmentConditionFilter(value)
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Conditions</SelectItem>
                                            <SelectItem value="GOOD">Good</SelectItem>
                                            <SelectItem value="FAIR">Fair</SelectItem>
                                            <SelectItem value="POOR">Poor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DataTable
                                    data={filteredEquipment}
                                    columns={equipmentColumns}
                                    getRowKey={(item) => item.id}
                                />
                                <PaginationControls
                                    page={equipmentPage}
                                    totalPages={equipmentQuery.data?.totalPages ?? 1}
                                    onPrevious={() => setEquipmentPage((prev) => Math.max(prev - 1, 1))}
                                    onNext={() =>
                                        setEquipmentPage((prev) =>
                                            Math.min(prev + 1, Math.max(equipmentQuery.data?.totalPages ?? 1, 1))
                                        )
                                    }
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

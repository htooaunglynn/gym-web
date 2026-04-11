import { useState } from 'react'
import { Search } from 'lucide-react'
import PageHeader from '@/components/PageHeader/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'
import { Input } from '@/components/Input/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/select'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'
import { useInventoryMovements, type InventoryMovementListItem } from '@/features/inventory/hooks/useInventoryMovements'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

export default function InventoryMovementsPage() {
    const [movementType, setMovementType] = useState<'all' | 'INCOMING' | 'OUTGOING' | 'ADJUSTMENT'>('all')
    const handleMovementTypeChange = (value: string) => {
        if (value === 'all' || value === 'INCOMING' || value === 'OUTGOING' || value === 'ADJUSTMENT') {
            setMovementType(value)
            setPage(1)
        }
    }

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)

    const { query, setQuery, filteredMovements, total, totalPages, isLoading, errorMessage } = useInventoryMovements({
        page,
        limit,
        movementType,
    })

    const columns: DataTableColumn<InventoryMovementListItem>[] = [
        {
            key: 'movementType',
            header: 'Type',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (movement) => <StatusBadge kind="inventory-movement" value={movement.movementType} />,
        },
        {
            key: 'equipmentId',
            header: 'Equipment ID',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (movement) => movement.equipmentId,
        },
        {
            key: 'quantity',
            header: 'Quantity',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (movement) => movement.quantity,
        },
        {
            key: 'reason',
            header: 'Reason',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (movement) => movement.reason,
        },
        {
            key: 'occurredAt',
            header: 'Occurred At',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4 text-muted-foreground',
            render: (movement) => movement.occurredAt,
        },
    ]

    return (
        <div>
            <PageHeader title="Inventory Movements" breadcrumb="GymHub / Inventory Movements" />

            <Card className="mb-4">
                <CardContent className="p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by equipment ID, reason, or note"
                            className="pl-9"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select
                            value={movementType}
                            onValueChange={handleMovementTypeChange}
                        >
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Movement Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Movements</SelectItem>
                                <SelectItem value="INCOMING">Incoming</SelectItem>
                                <SelectItem value="OUTGOING">Outgoing</SelectItem>
                                <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
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
                    <CardTitle>Movements</CardTitle>
                    <CardDescription>{total} records</CardDescription>
                </CardHeader>
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
                        <>
                            <DataTable
                                data={filteredMovements}
                                columns={columns}
                                getRowKey={(movement) => movement.id}
                                rowClassName="hover:bg-muted/30 transition-colors"
                                emptyMessage="No inventory movement records found."
                            />
                            <div className="flex items-center justify-between p-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Page {page} of {Math.max(totalPages, 1)}
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
                                        onClick={() => setPage((prev) => Math.min(prev + 1, Math.max(totalPages, 1)))}
                                        disabled={page >= Math.max(totalPages, 1)}
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

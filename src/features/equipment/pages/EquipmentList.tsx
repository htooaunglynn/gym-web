import { useState } from 'react'
import { Search } from 'lucide-react'
import PageHeader from '@/components/PageHeader/PageHeader'
import { Input } from '@/components/Input/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/select'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/StatusBadge/StatusBadge'
import { useEquipment, type EquipmentListItem } from '@/features/equipment/hooks/useEquipment'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

export default function EquipmentList() {
    const [conditionFilter, setConditionFilter] = useState<string>('all')
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)

    const { query, setQuery, filteredEquipment, total, totalPages, isLoading, errorMessage } = useEquipment({
        page,
        limit,
        conditionFilter,
    })

    const columns: DataTableColumn<EquipmentListItem>[] = [
        {
            key: 'name',
            header: 'Equipment',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (equipment) => (
                <div>
                    <p className="font-medium text-foreground">{equipment.name}</p>
                    <p className="text-xs text-muted-foreground">{equipment.description}</p>
                </div>
            ),
        },
        {
            key: 'quantity',
            header: 'Quantity',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (equipment) => equipment.quantity,
        },
        {
            key: 'condition',
            header: 'Condition',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4',
            render: (equipment) => <StatusBadge kind="equipment-condition" value={equipment.condition} />,
        },
        {
            key: 'managedBy',
            header: 'Managed By',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4 text-muted-foreground',
            render: (equipment) => equipment.managedBy,
        },
        {
            key: 'updatedAt',
            header: 'Updated At',
            headerClassName: 'py-3 px-4',
            cellClassName: 'py-3 px-4 text-muted-foreground',
            render: (equipment) => equipment.updatedAt,
        },
    ]

    return (
        <div>
            <PageHeader title="Equipment" breadcrumb="GymHub / Equipment" />

            <Card className="mb-4">
                <CardContent className="p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by equipment name, description, or manager"
                            className="pl-9"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select
                            value={conditionFilter}
                            onValueChange={(value) => {
                                setConditionFilter(value)
                                setPage(1)
                            }}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Conditions</SelectItem>
                                <SelectItem value="GOOD">Good</SelectItem>
                                <SelectItem value="FAIR">Fair</SelectItem>
                                <SelectItem value="POOR">Poor</SelectItem>
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
                    <CardTitle>Equipment List</CardTitle>
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
                                data={filteredEquipment}
                                columns={columns}
                                getRowKey={(equipment) => equipment.id}
                                rowClassName="hover:bg-muted/30 transition-colors"
                                emptyMessage="No equipment found."
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

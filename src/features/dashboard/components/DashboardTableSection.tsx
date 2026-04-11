import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'
import DataTable, { type DataTableColumn } from '@/components/Table/DataTable'
import { ErrorState } from '@/components/shared/ErrorState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'

interface DashboardTableSectionProps<T> {
    title: string
    description: string
    cardClassName?: string
    controls?: ReactNode
    isLoading: boolean
    errorMessage?: string | null
    data: T[]
    columns: DataTableColumn<T>[]
    getRowKey: (item: T) => string
    emptyMessage: string
    page: number
    totalPages: number
    onPrevious: () => void
    onNext: () => void
}

export function DashboardTableSection<T>({
    title,
    description,
    cardClassName,
    controls,
    isLoading,
    errorMessage,
    data,
    columns,
    getRowKey,
    emptyMessage,
    page,
    totalPages,
    onPrevious,
    onNext,
}: DashboardTableSectionProps<T>) {
    return (
        <Card className={cardClassName}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="py-10"><LoadingSpinner /></div>
                ) : errorMessage ? (
                    <div className="p-4"><ErrorState message={errorMessage} /></div>
                ) : (
                    <>
                        {controls ?? null}
                        <DataTable
                            data={data}
                            columns={columns}
                            getRowKey={getRowKey}
                            emptyMessage={emptyMessage}
                        />
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
                    </>
                )}
            </CardContent>
        </Card>
    )
}

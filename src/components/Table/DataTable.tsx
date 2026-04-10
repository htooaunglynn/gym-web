import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'

export interface DataTableColumn<T> {
  key: string
  header: ReactNode
  headerClassName?: string
  cellClassName?: string
  className?: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  getRowKey: (row: T) => string
  onRowClick?: (row: T) => void
  tableClassName?: string
  containerClassName?: string
  rowClassName?: string | ((row: T) => string)
  stickyHeader?: boolean
  emptyMessage?: string
}

export default function DataTable<T>({
  data,
  columns,
  getRowKey,
  onRowClick,
  tableClassName,
  containerClassName,
  rowClassName,
  stickyHeader = false,
  emptyMessage = 'No data available.',
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', containerClassName)}>
      <table className={cn('w-full text-sm', tableClassName)}>
        <thead className={cn(stickyHeader && 'sticky top-0 bg-white z-10')}>
          <tr className="border-b text-muted-foreground">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn('text-left py-2 font-medium', column.headerClassName, column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td className="py-6 text-center text-muted-foreground" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b last:border-0',
                onRowClick && 'cursor-pointer',
                typeof rowClassName === 'function' ? rowClassName(row) : rowClassName
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn('py-2.5', column.cellClassName, column.className)}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import { useMemo } from 'react'
import { useApiQuery, queryKeys } from '@/hooks/useApi'
import { inventoryService } from '@/services'
import useSearch from '@/hooks/useSearch'
import type { InventoryMovementResponse } from '@/types/api'

export interface InventoryMovementListItem {
    id: string
    equipmentId: string
    movementType: 'INCOMING' | 'OUTGOING' | 'ADJUSTMENT'
    quantity: number
    reason: string
    note: string
    occurredAt: string
    createdBy: string
}

interface UseInventoryMovementsParams {
    page: number
    limit: number
    movementType: 'all' | 'INCOMING' | 'OUTGOING' | 'ADJUSTMENT'
}

interface UseInventoryMovementsResult {
    query: string
    setQuery: (value: string) => void
    filteredMovements: InventoryMovementListItem[]
    total: number
    totalPages: number
    isLoading: boolean
    errorMessage: string | null
}

function toListItem(item: InventoryMovementResponse): InventoryMovementListItem {
    return {
        id: item.id,
        equipmentId: item.equipmentId,
        movementType: item.movementType,
        quantity: item.quantity,
        reason: item.reason,
        note: item.note ?? '-',
        occurredAt: new Date(item.occurredAt).toISOString().slice(0, 10),
        createdBy: item.createdBy ?? '-',
    }
}

export function useInventoryMovements({ page, limit, movementType }: UseInventoryMovementsParams): UseInventoryMovementsResult {
    const filters = {
        page,
        limit,
        includeDeleted: false,
        movementType: movementType === 'all' ? undefined : movementType,
    }

    const movementsQuery = useApiQuery(
        queryKeys.inventory.list(filters),
        () => inventoryService.list(filters),
        {
            placeholderData: (previousData) => previousData,
        }
    )

    const listItems = useMemo(() => {
        return (movementsQuery.data?.data ?? []).map(toListItem)
    }, [movementsQuery.data])

    const search = useSearch(listItems, (item, normalizedQuery) =>
        item.equipmentId.toLowerCase().includes(normalizedQuery) ||
        item.reason.toLowerCase().includes(normalizedQuery) ||
        item.note.toLowerCase().includes(normalizedQuery)
    )

    return {
        query: search.query,
        setQuery: search.setQuery,
        filteredMovements: search.filtered,
        total: movementsQuery.data?.total ?? 0,
        totalPages: movementsQuery.data?.totalPages ?? 1,
        isLoading: movementsQuery.isLoading,
        errorMessage: movementsQuery.error?.userMessage ?? null,
    }
}

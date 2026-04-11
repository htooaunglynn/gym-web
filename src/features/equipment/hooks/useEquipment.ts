import { useMemo } from 'react'
import { useApiQuery, queryKeys } from '@/hooks/useApi'
import { equipmentService } from '@/services'
import { useFilteredList } from '@/hooks/useFilteredList'
import type { EquipmentResponse } from '@/types/api'

export interface EquipmentListItem {
    id: string
    name: string
    description: string
    quantity: number
    condition: 'GOOD' | 'FAIR' | 'POOR'
    managedBy: string
    updatedAt: string
}

interface UseEquipmentParams {
    page: number
    limit: number
    conditionFilter: string
}

interface UseEquipmentResult {
    query: string
    setQuery: (query: string) => void
    filteredEquipment: EquipmentListItem[]
    total: number
    totalPages: number
    isLoading: boolean
    errorMessage: string | null
}

function toEquipmentListItem(raw: EquipmentResponse): EquipmentListItem {
    return {
        id: raw.id,
        name: raw.name,
        description: raw.description ?? '-',
        quantity: raw.quantity,
        condition: raw.condition,
        managedBy: raw.managedByUserId,
        updatedAt: new Date(raw.updatedAt).toISOString().slice(0, 10),
    }
}

export function useEquipment({ page, limit, conditionFilter }: UseEquipmentParams): UseEquipmentResult {
    const equipmentQuery = useApiQuery(
        queryKeys.equipment.list(page, limit),
        () => equipmentService.list({ page, limit, includeDeleted: false }),
        {
            placeholderData: (previousData) => previousData,
        }
    )

    const equipment = useMemo<EquipmentListItem[]>(() => {
        return (equipmentQuery.data?.data ?? []).map(toEquipmentListItem)
    }, [equipmentQuery.data])

    const filteredList = useFilteredList({
        items: equipment,
        searchPredicate: (item, normalizedQuery) =>
            item.name.toLowerCase().includes(normalizedQuery) ||
            item.description.toLowerCase().includes(normalizedQuery) ||
            item.managedBy.toLowerCase().includes(normalizedQuery),
        filters: [
            {
                isActive: conditionFilter !== 'all',
                predicate: (item) => item.condition === conditionFilter,
            },
        ],
    })

    return {
        query: filteredList.query,
        setQuery: filteredList.setQuery,
        filteredEquipment: filteredList.filtered,
        total: equipmentQuery.data?.total ?? 0,
        totalPages: equipmentQuery.data?.totalPages ?? 1,
        isLoading: equipmentQuery.isLoading,
        errorMessage: equipmentQuery.error?.userMessage ?? null,
    }
}

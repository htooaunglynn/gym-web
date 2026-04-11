import { useMemo } from 'react'
import useSearch from '@/hooks/useSearch'

interface FilterRule<T> {
    isActive: boolean
    predicate: (item: T) => boolean
}

interface UseFilteredListOptions<T> {
    items: T[]
    searchPredicate: (item: T, normalizedQuery: string) => boolean
    filters?: FilterRule<T>[]
    initialQuery?: string
}

export function useFilteredList<T>({
    items,
    searchPredicate,
    filters = [],
    initialQuery = '',
}: UseFilteredListOptions<T>) {
    const search = useSearch(items, searchPredicate, initialQuery)

    const filtered = useMemo(() => {
        return search.filtered.filter((item) =>
            filters.every((filterRule) => !filterRule.isActive || filterRule.predicate(item))
        )
    }, [search.filtered, filters])

    return {
        query: search.query,
        setQuery: search.setQuery,
        filtered,
    }
}

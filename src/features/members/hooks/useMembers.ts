import { useMemo } from 'react'
import type { Member } from '@/features/members/types'
import useSearch from '@/hooks/useSearch'
import { getMembers } from '@/features/members/services/memberService'

interface UseMembersParams {
    planFilter: string
    statusFilter: string
}

interface UseMembersResult {
    query: string
    setQuery: (query: string) => void
    filteredMembers: Member[]
}

export function useMembers({ planFilter, statusFilter }: UseMembersParams): UseMembersResult {
    const search = useSearch(getMembers(), (member, normalizedQuery) =>
        member.name.toLowerCase().includes(normalizedQuery) ||
        member.email.toLowerCase().includes(normalizedQuery) ||
        member.phone.toLowerCase().includes(normalizedQuery)
    )

    const filteredMembers = useMemo(() => {
        return search.filtered.filter((member) => {
            const matchesPlan = planFilter === 'all' || member.plan === planFilter
            const matchesStatus = statusFilter === 'all' || member.status === statusFilter
            return matchesPlan && matchesStatus
        })
    }, [search.filtered, planFilter, statusFilter])

    return {
        query: search.query,
        setQuery: search.setQuery,
        filteredMembers,
    }
}

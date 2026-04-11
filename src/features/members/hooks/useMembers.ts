import { useMemo } from 'react'
import { useApiQuery, queryKeys } from '@/hooks/useApi'
import { memberService } from '@/services'
import useSearch from '@/hooks/useSearch'

export interface MemberListItem {
    id: string
    name: string
    email: string
    phone: string
    avatar: string
    plan: 'Basic' | 'Standard' | 'Premium'
    status: 'Active' | 'Inactive' | 'Suspended'
    trainer: string
    attendanceRate: number
    joinDate: string
}

interface UseMembersParams {
    planFilter: string
    statusFilter: string
}

interface UseMembersResult {
    query: string
    setQuery: (query: string) => void
    filteredMembers: MemberListItem[]
    isLoading: boolean
    errorMessage: string | null
}

export function useMembers({ planFilter, statusFilter }: UseMembersParams): UseMembersResult {
    const membersQuery = useApiQuery(
        [...queryKeys.members.lists(), 'members-page'],
        () => memberService.list({ page: 1, limit: 100, includeDeleted: true })
    )

    const members = useMemo<MemberListItem[]>(() => {
        const raw = membersQuery.data?.data ?? []
        return raw.map((member) => {
            const firstName = member.firstName ?? ''
            const lastName = member.lastName ?? ''
            const fullName = `${firstName} ${lastName}`.trim() || member.email
            const avatarSeed = encodeURIComponent(fullName || member.id)

            return {
                id: member.id,
                name: fullName,
                email: member.email,
                phone: member.phone,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
                plan: 'Standard',
                status: member.deletedAt ? 'Inactive' : 'Active',
                trainer:
                    member.trainer?.firstName && member.trainer?.lastName
                        ? `${member.trainer.firstName} ${member.trainer.lastName}`
                        : 'Unassigned',
                attendanceRate: 0,
                joinDate: new Date(member.createdAt).toISOString().slice(0, 10),
            }
        })
    }, [membersQuery.data])

    const search = useSearch(members, (member, normalizedQuery) =>
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
        isLoading: membersQuery.isLoading,
        errorMessage: membersQuery.error?.userMessage ?? null,
    }
}

import { useMemo } from 'react'
import { useApiQuery, queryKeys } from '@/hooks/useApi'
import { memberService } from '@/services'
import { useFilteredList } from '@/hooks/useFilteredList'

export interface MemberListItem {
    id: string
    name: string
    email: string
    phone: string
    avatar: string
    status: 'Active' | 'Inactive' | 'Suspended'
    trainer: string
    joinDate: string
}

interface UseMembersParams {
    page: number
    limit: number
    statusFilter: string
}

interface UseMembersResult {
    query: string
    setQuery: (query: string) => void
    filteredMembers: MemberListItem[]
    total: number
    totalPages: number
    isLoading: boolean
    errorMessage: string | null
}

export function useMembers({ page, limit, statusFilter }: UseMembersParams): UseMembersResult {
    const membersQuery = useApiQuery(
        queryKeys.members.list(page, limit),
        () => memberService.list({ page, limit, includeDeleted: true }),
        {
            placeholderData: (previousData) => previousData,
        }
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
                status: member.deletedAt ? 'Inactive' : 'Active',
                trainer:
                    member.trainer?.firstName && member.trainer?.lastName
                        ? `${member.trainer.firstName} ${member.trainer.lastName}`
                        : 'Unassigned',
                joinDate: new Date(member.createdAt).toISOString().slice(0, 10),
            }
        })
    }, [membersQuery.data])

    const filteredList = useFilteredList({
        items: members,
        searchPredicate: (member, normalizedQuery) =>
            member.name.toLowerCase().includes(normalizedQuery) ||
            member.email.toLowerCase().includes(normalizedQuery) ||
            member.phone.toLowerCase().includes(normalizedQuery),
        filters: [
            {
                isActive: statusFilter !== 'all',
                predicate: (member) => member.status === statusFilter,
            },
        ],
    })

    return {
        query: filteredList.query,
        setQuery: filteredList.setQuery,
        filteredMembers: filteredList.filtered,
        total: membersQuery.data?.total ?? 0,
        totalPages: membersQuery.data?.totalPages ?? 1,
        isLoading: membersQuery.isLoading,
        errorMessage: membersQuery.error?.userMessage ?? null,
    }
}

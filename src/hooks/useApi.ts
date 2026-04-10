import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import type { AppError } from '@/services'

// Custom hook for queries with standard error handling
export function useApiQuery<TData>(
    queryKey: string[],
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, AppError>, 'queryKey' | 'queryFn'>
) {
    return useQuery<TData, AppError>({
        queryKey,
        queryFn,
        ...options,
    })
}

// Custom hook for mutations with standard error handling
export function useApiMutation<TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, AppError, TVariables>, 'mutationFn'>
) {
    return useMutation<TData, AppError, TVariables>({
        mutationFn,
        ...options,
    })
}

// Query key factory for consistent key naming
export const queryKeys = {
    auth: {
        all: ['auth'] as const,
        me: () => [...queryKeys.auth.all, 'me'] as const,
    },
    members: {
        all: ['members'] as const,
        lists: () => [...queryKeys.members.all, 'list'] as const,
        list: (page: number, limit: number) => [...queryKeys.members.lists(), page, limit] as const,
        details: () => [...queryKeys.members.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.members.details(), id] as const,
    },
    trainers: {
        all: ['trainers'] as const,
        lists: () => [...queryKeys.trainers.all, 'list'] as const,
        list: (page: number, limit: number, includeMembers?: boolean) =>
            [...queryKeys.trainers.lists(), page, limit, includeMembers] as const,
        details: () => [...queryKeys.trainers.all, 'detail'] as const,
        detail: (id: string, includeMembers?: boolean) =>
            [...queryKeys.trainers.details(), id, includeMembers] as const,
    },
    users: {
        all: ['users'] as const,
        lists: () => [...queryKeys.users.all, 'list'] as const,
        list: (page: number, limit: number) => [...queryKeys.users.lists(), page, limit] as const,
        details: () => [...queryKeys.users.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.users.details(), id] as const,
    },
    equipment: {
        all: ['equipment'] as const,
        lists: () => [...queryKeys.equipment.all, 'list'] as const,
        list: (page: number, limit: number) => [...queryKeys.equipment.lists(), page, limit] as const,
        details: () => [...queryKeys.equipment.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.equipment.details(), id] as const,
    },
    attendance: {
        all: ['attendance'] as const,
        lists: () => [...queryKeys.attendance.all, 'list'] as const,
        list: (filters: Record<string, any>) => [...queryKeys.attendance.lists(), filters] as const,
        details: () => [...queryKeys.attendance.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.attendance.details(), id] as const,
    },
    inventory: {
        all: ['inventory-movements'] as const,
        lists: () => [...queryKeys.inventory.all, 'list'] as const,
        list: (filters: Record<string, any>) => [...queryKeys.inventory.lists(), filters] as const,
        details: () => [...queryKeys.inventory.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.inventory.details(), id] as const,
    },
}

// Utility hook to invalidate queries after mutations
export function useInvalidateQueries() {
    const queryClient = useQueryClient()
    return {
        invalidateMembers: () => queryClient.invalidateQueries({ queryKey: queryKeys.members.all }),
        invalidateTrainers: () => queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all }),
        invalidateUsers: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
        invalidateEquipment: () => queryClient.invalidateQueries({ queryKey: queryKeys.equipment.all }),
        invalidateAttendance: () => queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all }),
        invalidateInventory: () => queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all }),
    }
}

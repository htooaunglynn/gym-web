"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useApi";
import * as memberService from "@/services/members";
import { ListMembersParams } from "@/services/members";
import { CreateMemberPayload, UpdateMemberPayload, Member } from "@/types/entities";
import { AppError, PaginatedResponse } from "@/types/api";

export function useMembers(params?: ListMembersParams) {
    return useQuery<PaginatedResponse<Member>, AppError>({
        queryKey: queryKeys.members.list(params as Record<string, unknown>),
        queryFn: () => memberService.getMembers(params),
    });
}

export function useMember(id: string) {
    return useQuery<Member, AppError>({
        queryKey: queryKeys.members.detail(id),
        queryFn: () => memberService.getMemberById(id),
        enabled: !!id,
    });
}

export function useCreateMember() {
    const queryClient = useQueryClient();
    return useMutation<ReturnType<typeof memberService.createMember> extends Promise<infer T> ? T : never, AppError, CreateMemberPayload>({
        mutationFn: memberService.createMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.members.all() });
        },
    });
}

export function useUpdateMember() {
    const queryClient = useQueryClient();
    return useMutation<ReturnType<typeof memberService.updateMember> extends Promise<infer T> ? T : never, AppError, { id: string; payload: UpdateMemberPayload }>({
        mutationFn: ({ id, payload }) => memberService.updateMember(id, payload),
        onSuccess: (_data, vars) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.members.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.members.detail(vars.id) });
        },
    });
}

export function useDeleteMember() {
    const queryClient = useQueryClient();
    return useMutation<void, AppError, string>({
        mutationFn: memberService.deleteMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.members.all() });
        },
    });
}

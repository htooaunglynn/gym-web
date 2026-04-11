import { get, post, patch, del } from "@/lib/api-client";
import {
    Member,
    CreateMemberPayload,
    UpdateMemberPayload,
} from "@/types/entities";
import { PaginatedResponse } from "@/types/api";

export interface ListMembersParams {
    page?: number;
    limit?: number;
    search?: string;
    trainerId?: string;
}

export async function getMembers(params?: ListMembersParams): Promise<PaginatedResponse<Member>> {
    return get<PaginatedResponse<Member>>("/members", params as Record<string, unknown>);
}

export async function getMemberById(id: string): Promise<Member> {
    return get<Member>(`/members/${id}`);
}

export async function createMember(payload: CreateMemberPayload): Promise<Member> {
    return post<Member>("/members", payload);
}

export async function updateMember(id: string, payload: UpdateMemberPayload): Promise<Member> {
    return patch<Member>(`/members/${id}`, payload);
}

export async function deleteMember(id: string): Promise<void> {
    return del<void>(`/members/${id}`);
}

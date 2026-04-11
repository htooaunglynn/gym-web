import { get, post, patch, del } from "@/lib/api-client";
import { User, CreateUserPayload, UpdateUserPayload } from "@/types/entities";
import { PaginatedResponse } from "@/types/api";

export interface ListUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
}

export async function getUsers(params?: ListUsersParams): Promise<PaginatedResponse<User>> {
    return get<PaginatedResponse<User>>("/users", params as Record<string, unknown>);
}

export async function getUserById(id: string): Promise<User> {
    return get<User>(`/users/${id}`);
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
    return post<User>("/users", payload);
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    return patch<User>(`/users/${id}`, payload);
}

export async function deleteUser(id: string): Promise<void> {
    return del<void>(`/users/${id}`);
}

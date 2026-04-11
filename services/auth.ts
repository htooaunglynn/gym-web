import { get, post } from "@/lib/api-client";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    return post<AuthResponse>("/auth/login", payload);
}

export async function registerMember(payload: RegisterPayload): Promise<AuthResponse> {
    return post<AuthResponse>("/auth/register/member", payload);
}

export async function getMe(): Promise<AuthResponse["user"]> {
    return get<AuthResponse["user"]>("/auth/me");
}

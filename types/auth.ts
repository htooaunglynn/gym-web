export type UserRole = "ADMIN" | "STAFF" | "TRAINER" | "MEMBER" | "HR";

export type AccountType = "USER" | "MEMBER";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface Member {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    trainerId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User | Member;
}

export interface LoginPayload {
    email: string;
    password: string;
    accountType?: AccountType;
}

export interface RegisterPayload {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    password: string;
}

import { apiClient } from './api'
import type { LoginDTO, RegisterMemberDTO, AuthResponse, MeResponse } from '@/types/api'

export const authService = {
    async login(dto: LoginDTO): Promise<AuthResponse> {
        return apiClient.post('/auth/login', dto)
    },

    async registerMember(dto: RegisterMemberDTO): Promise<AuthResponse> {
        return apiClient.post('/auth/register/member', dto)
    },

    async getMe(): Promise<MeResponse> {
        return apiClient.get('/auth/me')
    },

    logout(): void {
        apiClient.setToken(null)
        if (typeof window !== 'undefined') {
            localStorage.removeItem('gymhub_token')
            localStorage.removeItem('gymhub_role')
        }
    },

    setAuthToken(token: string): void {
        apiClient.setToken(token)
        if (typeof window !== 'undefined') {
            localStorage.setItem('gymhub_token', token)
        }
    },

    getAuthToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('gymhub_token')
        }
        return null
    },
}

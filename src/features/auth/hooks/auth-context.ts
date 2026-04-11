import { createContext } from 'react'
import type { MeResponse } from '@/types/api'
import type { UserRole } from '@/utils/role'

export interface AuthContextType {
    currentUser: MeResponse | null
    currentUserRole: UserRole | null
    dashboardPath: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<UserRole>
    registerMember: (email: string, phone: string, firstName: string, lastName: string, password: string) => Promise<UserRole>
    logout: () => void
    clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

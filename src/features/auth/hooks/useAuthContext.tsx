import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService } from '@/services'
import type { MeResponse } from '@/types/api'
import { setCurrentRole } from '@/utils/role'

interface AuthContextType {
    currentUser: MeResponse | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    registerMember: (email: string, phone: string, firstName: string, lastName: string, password: string) => Promise<void>
    logout: () => void
    clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<MeResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Bootstrap auth on mount
    useEffect(() => {
        const bootstrapAuth = async () => {
            const token = authService.getAuthToken()
            if (token) {
                try {
                    const user = await authService.getMe()
                    setCurrentUser(user)
                    // Map API role to app role
                    const appRole = mapApiRoleToAppRole(user.role)
                    setCurrentRole(appRole as any)
                } catch (err) {
                    authService.setAuthToken('')
                    setCurrentUser(null)
                }
            }
            setIsLoading(false)
        }
        bootstrapAuth()
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await authService.login({ email, password, accountType: 'USER' })
            authService.setAuthToken(response.accessToken)
            const user = await authService.getMe()
            setCurrentUser(user)
            const appRole = mapApiRoleToAppRole(user.role)
            setCurrentRole(appRole as any)
        } catch (err: any) {
            const message = err?.userMessage || 'Login failed'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const registerMember = async (
        email: string,
        phone: string,
        firstName: string,
        lastName: string,
        password: string
    ) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await authService.registerMember({
                email,
                phone,
                firstName,
                lastName,
                password,
            })
            authService.setAuthToken(response.accessToken)
            const user = await authService.getMe()
            setCurrentUser(user)
            const appRole = mapApiRoleToAppRole(user.role)
            setCurrentRole(appRole as any)
        } catch (err: any) {
            const message = err?.userMessage || 'Registration failed'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        authService.logout()
        setCurrentUser(null)
        setError(null)
    }

    const clearError = () => {
        setError(null)
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated: !!currentUser,
                isLoading,
                error,
                login,
                registerMember,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

// Helper to map API roles to app roles
function mapApiRoleToAppRole(apiRole: string): string {
    const roleMap: Record<string, string> = {
        ADMIN: 'admin',
        STAFF: 'staff',
        HR: 'staff',
        MEMBER: 'member',
        TRAINER: 'trainer',
    }
    return roleMap[apiRole] || 'member'
}

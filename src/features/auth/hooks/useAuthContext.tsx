import { useState, useEffect, type ReactNode } from 'react'
import { authService, type AppError } from '@/services'
import { clearCurrentRole, getRoleDashboardPath, mapApiRoleToAppRole, setCurrentRole } from '@/utils/role'
import { AuthContext } from '@/features/auth/hooks/auth-context'
import type { MeResponse } from '@/types/api'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<MeResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const currentUserRole = currentUser ? mapApiRoleToAppRole(currentUser.role) : null
    const dashboardPath = currentUserRole ? getRoleDashboardPath(currentUserRole) : null

    // Bootstrap auth on mount
    useEffect(() => {
        const bootstrapAuth = async () => {
            const token = authService.getAuthToken()
            if (token) {
                try {
                    const user = await authService.getMe()
                    setCurrentUser(user)
                    const appRole = mapApiRoleToAppRole(user.role)
                    setCurrentRole(appRole)
                } catch {
                    authService.setAuthToken('')
                    clearCurrentRole()
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
            setCurrentRole(appRole)
            return appRole
        } catch (error: unknown) {
            const message = getErrorMessage(error, 'Login failed')
            setError(message)
            throw error
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
            setCurrentRole(appRole)
            return appRole
        } catch (error: unknown) {
            const message = getErrorMessage(error, 'Registration failed')
            setError(message)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        authService.logout()
        clearCurrentRole()
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
                currentUserRole,
                dashboardPath,
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

function getErrorMessage(error: unknown, fallback: string): string {
    if (isAppError(error)) {
        return error.userMessage
    }

    return fallback
}

function isAppError(error: unknown): error is AppError {
    return typeof error === 'object' && error !== null && 'userMessage' in error
}

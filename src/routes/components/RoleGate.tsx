import type { ReactElement } from 'react'
import { Navigate } from 'react-router'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getCurrentRole, getRoleDashboardPath, type UserRole } from '@/utils/role'

interface RoleGateProps {
    allowedRole: UserRole
    children: ReactElement
}

export default function RoleGate({ allowedRole, children }: RoleGateProps) {
    const { isAuthenticated, isLoading, currentUserRole } = useAuth()

    if (isLoading) {
        return <LoadingSpinner fullScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />
    }

    const currentRole = currentUserRole ?? getCurrentRole()

    if (currentRole !== allowedRole) {
        return <Navigate to={getRoleDashboardPath(currentRole)} replace />
    }

    return children
}

import type { ReactElement } from 'react'
import { Navigate } from 'react-router'
import { getCurrentRole, getRoleDashboardPath, type UserRole } from '@/utils/role'

interface RoleGateProps {
    allowedRole: UserRole
    children: ReactElement
}

export default function RoleGate({ allowedRole, children }: RoleGateProps) {
    const currentRole = getCurrentRole()

    if (currentRole !== allowedRole) {
        return <Navigate to={getRoleDashboardPath(currentRole)} replace />
    }

    return children
}

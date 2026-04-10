export type UserRole = 'admin' | 'member' | 'staff' | 'trainer'

const ROLE_STORAGE_KEY = 'gymhub_role'

const VALID_ROLES: UserRole[] = ['admin', 'member', 'staff', 'trainer']

export const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    member: 'Member',
    staff: 'Staff',
    trainer: 'Trainer',
}

// Path domains can be mapped to host domains later with the same role keys.
export const roleDomainMap: Record<UserRole, string> = {
    admin: 'admin',
    member: 'member',
    staff: 'staff',
    trainer: 'trainer',
}

export function isUserRole(value: string | null): value is UserRole {
    return value !== null && VALID_ROLES.includes(value as UserRole)
}

export function getRoleDashboardPath(role: UserRole): string {
    return `/${roleDomainMap[role]}/dashboard`
}

export function setCurrentRole(role: UserRole): void {
    if (typeof window === 'undefined') {
        return
    }

    window.localStorage.setItem(ROLE_STORAGE_KEY, role)
}

export function getCurrentRole(): UserRole {
    if (typeof window === 'undefined') {
        return 'admin'
    }

    const queryRole = new URLSearchParams(window.location.search).get('as')

    if (isUserRole(queryRole)) {
        setCurrentRole(queryRole)
        return queryRole
    }

    const storedRole = window.localStorage.getItem(ROLE_STORAGE_KEY)

    if (isUserRole(storedRole)) {
        return storedRole
    }

    return 'admin'
}

export type UserRole = 'admin' | 'member' | 'staff' | 'trainer'

type ApiRole = 'ADMIN' | 'STAFF' | 'HR' | 'MEMBER' | 'TRAINER'

const ROLE_STORAGE_KEY = 'gymhub_role'

const VALID_ROLES: UserRole[] = ['admin', 'member', 'staff', 'trainer']

const API_ROLE_MAP: Record<ApiRole, UserRole> = {
    ADMIN: 'admin',
    STAFF: 'staff',
    HR: 'staff',
    MEMBER: 'member',
    TRAINER: 'trainer',
}

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

export function clearCurrentRole(): void {
    if (typeof window === 'undefined') {
        return
    }

    window.localStorage.removeItem(ROLE_STORAGE_KEY)
}

export function getStoredRole(): UserRole | null {
    if (typeof window === 'undefined') {
        return null
    }

    const storedRole = window.localStorage.getItem(ROLE_STORAGE_KEY)

    if (isUserRole(storedRole)) {
        return storedRole
    }

    return null
}

export function getCurrentRole(fallback: UserRole = 'admin'): UserRole {
    return getStoredRole() ?? fallback
}

export function mapApiRoleToAppRole(apiRole: ApiRole | string): UserRole {
    return API_ROLE_MAP[apiRole as ApiRole] ?? 'member'
}

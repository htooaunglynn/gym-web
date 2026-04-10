import type { LucideIcon } from 'lucide-react'
import type { UserRole } from '@/utils/role'

export interface DomainNavItem {
    to: string
    label: string
    icon: LucideIcon
}

export interface RoleLayoutConfig {
    role: UserRole
    title: string
    navItems: DomainNavItem[]
}

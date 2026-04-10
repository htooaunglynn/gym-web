import { LayoutDashboard, Users, ClipboardCheck, User } from 'lucide-react'
import type { DomainNavItem } from '@/layouts/domains/types'

export const trainerNav: DomainNavItem[] = [
    { to: '/trainer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/trainer/members', icon: Users, label: 'My Members' },
    { to: '/trainer/attendance', icon: ClipboardCheck, label: 'Attendance' },
    { to: '/trainer/profile', icon: User, label: 'Profile' },
]

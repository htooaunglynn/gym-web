import { LayoutDashboard, UserRound, ClipboardCheck } from 'lucide-react'
import type { DomainNavItem } from '@/layouts/domains/types'

export const memberNav: DomainNavItem[] = [
    { to: '/member/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/member/attendance', icon: ClipboardCheck, label: 'My Attendance' },
    { to: '/member/profile', icon: UserRound, label: 'My Profile' },
]

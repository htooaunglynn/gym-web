import { LayoutDashboard, UserRound } from 'lucide-react'
import type { DomainNavItem } from '@/layouts/domains/types'

export const memberNav: DomainNavItem[] = [
    { to: '/member/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/member/dashboard', icon: UserRound, label: 'My Profile' },
]

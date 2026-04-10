import { LayoutDashboard, BriefcaseBusiness } from 'lucide-react'
import type { DomainNavItem } from '@/layouts/domains/types'

export const staffNav: DomainNavItem[] = [
    { to: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/staff/dashboard', icon: BriefcaseBusiness, label: 'Operations' },
]

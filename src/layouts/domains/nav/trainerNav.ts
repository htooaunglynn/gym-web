import { LayoutDashboard, Dumbbell } from 'lucide-react'
import type { DomainNavItem } from '@/layouts/domains/types'

export const trainerNav: DomainNavItem[] = [
    { to: '/trainer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/trainer/dashboard', icon: Dumbbell, label: 'My Classes' },
]

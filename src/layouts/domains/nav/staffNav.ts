import { LayoutDashboard, Users, ClipboardCheck, Dumbbell, Package } from 'lucide-react'
import type { DomainNavItem } from '@/layouts/domains/types'

export const staffNav: DomainNavItem[] = [
    { to: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/staff/members', icon: Users, label: 'Members' },
    { to: '/staff/attendance', icon: ClipboardCheck, label: 'Attendance' },
    { to: '/staff/equipment', icon: Dumbbell, label: 'Equipment' },
    { to: '/staff/inventory-movements', icon: Package, label: 'Inventory Movements' },
]

import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardCheck,
    TrendingUp,
    DollarSign,
    CalendarOff,
    MessageSquare,
    UserPlus,
} from 'lucide-react'
import type { DomainNavItem } from '@/layouts/domains/types'

export const adminNav: DomainNavItem[] = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/members', icon: Users, label: 'Members' },
    { to: '/admin/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/admin/attendance', icon: ClipboardCheck, label: 'Attendance' },
    { to: '/admin/performance', icon: TrendingUp, label: 'Performance' },
    { to: '/admin/payroll', icon: DollarSign, label: 'Payroll' },
    { to: '/admin/leave', icon: CalendarOff, label: 'Leave Management' },
    { to: '/admin/inbox', icon: MessageSquare, label: 'Inbox' },
    { to: '/admin/recruitment', icon: UserPlus, label: 'Recruitment' },
]

import { NavLink } from 'react-router'
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
    Dumbbell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
    { to: '/performance', icon: TrendingUp, label: 'Performance' },
    { to: '/payroll', icon: DollarSign, label: 'Payroll' },
    { to: '/leave', icon: CalendarOff, label: 'Leave Management' },
    { to: '/inbox', icon: MessageSquare, label: 'Inbox' },
    { to: '/recruitment', icon: UserPlus, label: 'Recruitment' },
]

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-border flex flex-col z-30">
            {/* Logo */}
            <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-base text-foreground">GymHub</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-0.5">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )
                                }
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Promo Banner */}
            <div className="m-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-xs font-semibold text-primary mb-1">Level Up Your Gym</p>
                <p className="text-xs text-muted-foreground mb-2">
                    GymHub Pro gives you full control with advanced modules.
                </p>
                <button className="w-full text-xs font-medium bg-primary text-primary-foreground rounded-lg py-1.5 hover:bg-primary/90 transition-colors">
                    Get GymHub Pro
                </button>
            </div>
        </aside>
    )
}

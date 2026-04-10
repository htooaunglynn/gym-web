import { NavLink } from 'react-router'
import { Dumbbell } from 'lucide-react'
import { cn } from '@/utils/utils'
import type { DomainNavItem } from '@/layouts/domains/types'

interface DomainSidebarProps {
    title: string
    navItems: DomainNavItem[]
}

export default function DomainSidebar({ title, navItems }: DomainSidebarProps) {
    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-border flex flex-col z-30">
            <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-base text-foreground">{title}</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-0.5">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <li key={`${to}-${label}`}>
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
        </aside>
    )
}

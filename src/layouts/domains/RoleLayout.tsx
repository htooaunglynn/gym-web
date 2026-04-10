import { Outlet } from 'react-router'
import type { RoleLayoutConfig } from '@/layouts/domains/types'
import DomainHeader from '@/layouts/domains/DomainHeader'
import DomainSidebar from '@/layouts/domains/DomainSidebar'

export default function RoleLayout({ role, title, navItems }: RoleLayoutConfig) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <DomainSidebar title={title} navItems={navItems} />
            <div className="flex-1 flex flex-col ml-60">
                <DomainHeader role={role} />
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-60">
                <Header />
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

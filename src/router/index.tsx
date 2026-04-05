import { Routes, Route, Navigate } from 'react-router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Dashboard from '@/pages/Dashboard'
import MembersList from '@/pages/Members/MembersList'
import MemberDetail from '@/pages/Members/MemberDetail'
import CalendarPage from '@/pages/CalendarPage'
import AttendancePage from '@/pages/AttendancePage'
import PerformancePage from '@/pages/PerformancePage'
import PayrollPage from '@/pages/PayrollPage'
import LeaveManagementPage from '@/pages/LeaveManagementPage'
import InboxPage from '@/pages/InboxPage'
import RecruitmentPage from '@/pages/RecruitmentPage'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/members" element={<MembersList />} />
                <Route path="/members/:id" element={<MemberDetail />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/payroll" element={<PayrollPage />} />
                <Route path="/leave" element={<LeaveManagementPage />} />
                <Route path="/inbox" element={<InboxPage />} />
                <Route path="/recruitment" element={<RecruitmentPage />} />
            </Route>
        </Routes>
    )
}

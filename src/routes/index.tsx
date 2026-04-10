import { Routes, Route, Navigate } from 'react-router'
import { getCurrentRole, getRoleDashboardPath } from '@/utils/role'
import RoleGate from '@/routes/components/RoleGate'
import AdminLayout from '@/layouts/domains/AdminLayout'
import MemberLayout from '@/layouts/domains/MemberLayout'
import StaffLayout from '@/layouts/domains/StaffLayout'
import TrainerLayout from '@/layouts/domains/TrainerLayout'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import MembersList from '@/features/members/pages/MembersList'
import MemberDetail from '@/features/members/pages/MemberDetail'
import CalendarPage from '@/features/schedule/pages/CalendarPage'
import AttendancePage from '@/features/attendance/pages/AttendancePage'
import PerformancePage from '@/features/performance/pages/PerformancePage'
import PayrollPage from '@/features/payroll/pages/PayrollPage'
import LeaveManagementPage from '@/features/leave/pages/LeaveManagementPage'
import InboxPage from '@/features/inbox/pages/InboxPage'
import RecruitmentPage from '@/features/recruitment/pages/RecruitmentPage'
import MemberDashboardPage from '@/features/auth/pages/MemberDashboardPage'
import StaffDashboardPage from '@/features/auth/pages/StaffDashboardPage'
import TrainerDashboardPage from '@/features/trainers/pages/TrainerDashboardPage'
import LegacyMemberDetailRedirect from '@/routes/components/LegacyMemberDetailRedirect'

export default function AppRouter() {
    const roleHomePath = getRoleDashboardPath(getCurrentRole())

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Legacy paths kept for smooth migration */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/members" element={<Navigate to="/admin/members" replace />} />
            <Route path="/members/:id" element={<LegacyMemberDetailRedirect />} />
            <Route path="/calendar" element={<Navigate to="/admin/calendar" replace />} />
            <Route path="/attendance" element={<Navigate to="/admin/attendance" replace />} />
            <Route path="/performance" element={<Navigate to="/admin/performance" replace />} />
            <Route path="/payroll" element={<Navigate to="/admin/payroll" replace />} />
            <Route path="/leave" element={<Navigate to="/admin/leave" replace />} />
            <Route path="/inbox" element={<Navigate to="/admin/inbox" replace />} />
            <Route path="/recruitment" element={<Navigate to="/admin/recruitment" replace />} />

            <Route
                path="/admin"
                element={
                    <RoleGate allowedRole="admin">
                        <AdminLayout />
                    </RoleGate>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="members" element={<MembersList />} />
                <Route path="members/:id" element={<MemberDetail />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="performance" element={<PerformancePage />} />
                <Route path="payroll" element={<PayrollPage />} />
                <Route path="leave" element={<LeaveManagementPage />} />
                <Route path="inbox" element={<InboxPage />} />
                <Route path="recruitment" element={<RecruitmentPage />} />
            </Route>

            <Route
                path="/member"
                element={
                    <RoleGate allowedRole="member">
                        <MemberLayout />
                    </RoleGate>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<MemberDashboardPage />} />
            </Route>

            <Route
                path="/staff"
                element={
                    <RoleGate allowedRole="staff">
                        <StaffLayout />
                    </RoleGate>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StaffDashboardPage />} />
            </Route>

            <Route
                path="/trainer"
                element={
                    <RoleGate allowedRole="trainer">
                        <TrainerLayout />
                    </RoleGate>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<TrainerDashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to={roleHomePath} replace />} />
        </Routes>
    )
}

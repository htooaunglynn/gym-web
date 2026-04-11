import { Routes, Route, Navigate } from 'react-router'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import RoleGate from '@/routes/components/RoleGate'
import AdminLayout from '@/layouts/domains/AdminLayout'
import MemberLayout from '@/layouts/domains/MemberLayout'
import StaffLayout from '@/layouts/domains/StaffLayout'
import TrainerLayout from '@/layouts/domains/TrainerLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
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
import EquipmentList from '@/features/equipment/pages/EquipmentList'
import InventoryMovementsPage from '@/features/inventory/pages/InventoryMovementsPage'

export default function AppRouter() {
    const { isAuthenticated, isLoading, dashboardPath } = useAuth()

    if (isLoading) {
        return <LoadingSpinner fullScreen />
    }

    const authenticatedHomePath = dashboardPath ?? '/auth/login'
    const rootPath = isAuthenticated ? authenticatedHomePath : '/auth/login'

    return (
        <Routes>
            {/* Auth routes */}
            <Route
                path="/auth/login"
                element={isAuthenticated ? <Navigate to={authenticatedHomePath} replace /> : <LoginPage />}
            />
            <Route
                path="/auth/register"
                element={isAuthenticated ? <Navigate to={authenticatedHomePath} replace /> : <RegisterPage />}
            />

            <Route path="/" element={<Navigate to={rootPath} replace />} />

            {/* Legacy paths kept for smooth migration */}
            <Route path="/dashboard" element={<Navigate to={isAuthenticated ? '/admin/dashboard' : '/auth/login'} replace />} />
            <Route path="/members" element={<Navigate to={isAuthenticated ? '/admin/members' : '/auth/login'} replace />} />
            <Route path="/members/:id" element={<LegacyMemberDetailRedirect />} />
            <Route path="/calendar" element={<Navigate to={isAuthenticated ? '/admin/calendar' : '/auth/login'} replace />} />
            <Route path="/attendance" element={<Navigate to={isAuthenticated ? '/admin/attendance' : '/auth/login'} replace />} />
            <Route path="/performance" element={<Navigate to={isAuthenticated ? '/admin/performance' : '/auth/login'} replace />} />
            <Route path="/payroll" element={<Navigate to={isAuthenticated ? '/admin/payroll' : '/auth/login'} replace />} />
            <Route path="/leave" element={<Navigate to={isAuthenticated ? '/admin/leave' : '/auth/login'} replace />} />
            <Route path="/inbox" element={<Navigate to={isAuthenticated ? '/admin/inbox' : '/auth/login'} replace />} />
            <Route path="/recruitment" element={<Navigate to={isAuthenticated ? '/admin/recruitment' : '/auth/login'} replace />} />

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
                <Route path="equipment" element={<EquipmentList />} />
                <Route path="inventory-movements" element={<InventoryMovementsPage />} />
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

            <Route path="*" element={<Navigate to={rootPath} replace />} />
        </Routes>
    )
}

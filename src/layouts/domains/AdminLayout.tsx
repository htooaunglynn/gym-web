import RoleLayout from '@/layouts/domains/RoleLayout'
import { adminNav } from '@/layouts/domains/nav/adminNav'

export default function AdminLayout() {
    return <RoleLayout role="admin" title="GymHub Admin" navItems={adminNav} />
}

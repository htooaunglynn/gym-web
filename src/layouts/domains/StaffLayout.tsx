import RoleLayout from '@/layouts/domains/RoleLayout'
import { staffNav } from '@/layouts/domains/nav/staffNav'

export default function StaffLayout() {
    return <RoleLayout role="staff" title="GymHub Staff" navItems={staffNav} />
}

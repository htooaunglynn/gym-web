import RoleLayout from '@/layouts/domains/RoleLayout'
import { memberNav } from '@/layouts/domains/nav/memberNav'

export default function MemberLayout() {
    return <RoleLayout role="member" title="GymHub Member" navItems={memberNav} />
}

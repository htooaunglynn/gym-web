import RoleLayout from '@/layouts/domains/RoleLayout'
import { trainerNav } from '@/layouts/domains/nav/trainerNav'

export default function TrainerLayout() {
    return <RoleLayout role="trainer" title="GymHub Trainer" navItems={trainerNav} />
}

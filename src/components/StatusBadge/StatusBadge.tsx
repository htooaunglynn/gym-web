import { Badge } from '@/components/Badge/badge'

type StatusKind =
    | 'member-status'
    | 'member-plan'
    | 'payment-status'
    | 'leave-status'
    | 'recruitment-status'
    | 'equipment-condition'
    | 'inventory-movement'

interface StatusBadgeProps {
    kind: StatusKind
    value: string
}

const variantMap: Record<StatusKind, Record<string, 'success' | 'warning' | 'danger' | 'info' | 'secondary'>> = {
    'member-status': {
        Active: 'success',
        Inactive: 'secondary',
        Suspended: 'warning',
    },
    'member-plan': {
        Premium: 'success',
        Standard: 'info',
        Basic: 'secondary',
    },
    'payment-status': {
        Paid: 'success',
        Pending: 'warning',
        Overdue: 'danger',
    },
    'leave-status': {
        Approved: 'success',
        Pending: 'warning',
        Rejected: 'danger',
    },
    'recruitment-status': {
        Accepted: 'success',
        Pending: 'warning',
        Rejected: 'danger',
        Interview: 'info',
    },
    'equipment-condition': {
        GOOD: 'success',
        FAIR: 'warning',
        POOR: 'danger',
    },
    'inventory-movement': {
        INCOMING: 'success',
        OUTGOING: 'warning',
        ADJUSTMENT: 'info',
    },
}

export default function StatusBadge({ kind, value }: StatusBadgeProps) {
    return <Badge variant={variantMap[kind][value] ?? 'secondary'}>{value}</Badge>
}

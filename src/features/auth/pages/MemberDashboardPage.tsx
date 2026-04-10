import PageHeader from '@/components/PageHeader/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'

export default function MemberDashboardPage() {
    return (
        <div>
            <PageHeader title="Member Dashboard" breadcrumb="GymHub / Member" />
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to your member domain</CardTitle>
                    <CardDescription>
                        This role layout is ready for member-specific modules.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Next phase can add membership status, bookings, personal attendance,
                        and payment history widgets for members.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

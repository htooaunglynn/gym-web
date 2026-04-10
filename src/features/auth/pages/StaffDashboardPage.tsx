import PageHeader from '@/components/PageHeader/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'

export default function StaffDashboardPage() {
    return (
        <div>
            <PageHeader title="Staff Dashboard" breadcrumb="GymHub / Staff" />
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to your staff domain</CardTitle>
                    <CardDescription>
                        This role layout is ready for staff operations workflows.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Next phase can add front-desk queues, check-in controls,
                        support inbox, and daily operations tasks.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

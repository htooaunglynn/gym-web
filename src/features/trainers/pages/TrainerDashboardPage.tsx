import PageHeader from '@/components/PageHeader/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'

export default function TrainerDashboardPage() {
    return (
        <div>
            <PageHeader title="Trainer Dashboard" breadcrumb="GymHub / Trainer" />
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to your trainer domain</CardTitle>
                    <CardDescription>
                        This role layout is ready for trainer scheduling and coaching tools.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Next phase can add trainer class roster, performance notes,
                        leave requests, and personal KPI cards.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

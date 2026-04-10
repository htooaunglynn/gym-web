import { Star } from 'lucide-react'
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts'
import PageHeader from '@/components/PageHeader/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import { Progress } from '@/components/Progress/progress'
import { trainers, classPopularity, planDistribution } from '@/features/performance/data'

export default function PerformancePage() {
    return (
        <div>
            <PageHeader title="Performance" breadcrumb="GymHub / Performance" />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
                <Card className="xl:col-span-5">
                    <CardHeader>
                        <CardTitle>Trainer Performance</CardTitle>
                        <CardDescription>Rating and managed members</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {trainers.map((trainer) => (
                            <div key={trainer.id} className="p-3 rounded-lg border bg-muted/20">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <Avatar className="w-9 h-9">
                                            <AvatarImage src={trainer.avatar} />
                                            <AvatarFallback>{trainer.name.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{trainer.name}</p>
                                            <p className="text-xs text-muted-foreground">{trainer.specialty}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        {trainer.rating}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Members managed</span>
                                    <span className="font-medium">{trainer.members}</span>
                                </div>
                                <Progress value={(trainer.members / 70) * 100} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="xl:col-span-7">
                    <CardHeader>
                        <CardTitle>Class Popularity</CardTitle>
                        <CardDescription>Total attendees by class type</CardDescription>
                    </CardHeader>
                    <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={classPopularity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="class" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="attendees" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Member Plan Breakdown</CardTitle>
                    <CardDescription>Retention and subscription mix</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={planDistribution}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {planDistribution.map((item) => (
                                    <Cell key={item.name} fill={item.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
    title: string
    value: string | number
    delta?: string
    deltaType?: 'positive' | 'negative' | 'neutral'
    icon: LucideIcon
    iconColor?: string
    iconBg?: string
    subtitle?: string
}

export default function StatCard({
    title,
    value,
    delta,
    deltaType = 'positive',
    icon: Icon,
    iconColor = 'text-primary',
    iconBg = 'bg-primary/10',
    subtitle,
}: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{title}</p>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                        {delta && (
                            <p
                                className={cn(
                                    'text-xs mt-1 font-medium',
                                    deltaType === 'positive' && 'text-emerald-600',
                                    deltaType === 'negative' && 'text-red-500',
                                    deltaType === 'neutral' && 'text-muted-foreground'
                                )}
                            >
                                {delta}
                            </p>
                        )}
                        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                    </div>
                    <div className={cn('p-2.5 rounded-xl', iconBg)}>
                        <Icon className={cn('w-5 h-5', iconColor)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

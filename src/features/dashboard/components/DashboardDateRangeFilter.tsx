import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type DatePreset = 'today' | '7d' | '30d' | 'custom'

interface DashboardDateRangeFilterProps {
    title: string
    description: string
    preset: DatePreset
    from: string
    to: string
    onPresetChange: (preset: DatePreset) => void
    onFromChange: (from: string) => void
    onToChange: (to: string) => void
    extraControls?: ReactNode
}

export function DashboardDateRangeFilter({
    title,
    description,
    preset,
    from,
    to,
    onPresetChange,
    onFromChange,
    onToChange,
    extraControls,
}: DashboardDateRangeFilterProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Select
                    value={preset}
                    onValueChange={(value) => {
                        if (value === 'today' || value === '7d' || value === '30d' || value === 'custom') {
                            onPresetChange(value)
                        }
                    }}
                >
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
                {preset === 'custom' ? (
                    <>
                        <Input type="date" value={from} onChange={(event) => onFromChange(event.target.value)} />
                        <Input type="date" value={to} onChange={(event) => onToChange(event.target.value)} />
                    </>
                ) : null}
                {extraControls ?? null}
            </CardContent>
        </Card>
    )
}

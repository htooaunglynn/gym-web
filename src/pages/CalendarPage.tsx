import { useMemo, useState } from 'react'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    parseISO,
    addMonths,
    subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { classes, typeColors } from '@/data/schedule'

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1))
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 3, 5))

    const days = useMemo(() => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(currentMonth)
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

        return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    }, [currentMonth])

    const selectedDayClasses = classes.filter((session) =>
        isSameDay(parseISO(session.date), selectedDate)
    )

    const classesByDay = useMemo(() => {
        return classes.reduce<Record<string, number>>((acc, session) => {
            acc[session.date] = (acc[session.date] ?? 0) + 1
            return acc
        }, {})
    }, [])

    return (
        <div>
            <PageHeader title="Calendar" breadcrumb="GymHub / Calendar">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <Card className="xl:col-span-8">
                    <CardHeader className="pb-3">
                        <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                <div key={day} className="py-2 font-medium">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day) => {
                                const dateKey = format(day, 'yyyy-MM-dd')
                                const classCount = classesByDay[dateKey] ?? 0
                                const isSelected = isSameDay(day, selectedDate)
                                const isCurrent = isSameMonth(day, currentMonth)

                                return (
                                    <button
                                        key={day.toISOString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={`
                      min-h-24 rounded-lg border p-2 text-left transition-colors
                      ${isSelected ? 'border-primary bg-primary/10' : 'border-border bg-white hover:bg-muted/50'}
                      ${!isCurrent ? 'opacity-40' : ''}
                    `}
                                    >
                                        <p className="text-xs font-medium mb-2">{format(day, 'd')}</p>
                                        {classCount > 0 && (
                                            <div className="space-y-1">
                                                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-medium">
                                                    {classCount} class{classCount > 1 ? 'es' : ''}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-4">
                    <CardHeader>
                        <CardTitle>{format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-[520px] overflow-auto">
                        {selectedDayClasses.length === 0 && (
                            <p className="text-sm text-muted-foreground">No classes scheduled.</p>
                        )}
                        {selectedDayClasses.map((session) => (
                            <div key={session.id} className="p-3 rounded-lg border bg-muted/20">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-sm">{session.name}</p>
                                    <Badge className={typeColors[session.type]}>{session.type}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mb-1">
                                    <Clock className="w-3 h-3" />
                                    {session.startTime} - {session.endTime}
                                </p>
                                <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mb-1 ml-2">
                                    <MapPin className="w-3 h-3" />
                                    {session.room}
                                </p>
                                <p className="text-xs text-muted-foreground">Trainer: {session.trainer}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {session.enrolled}/{session.capacity} enrolled
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
    title?: string
    message?: string
    buttonText?: string
    onAction?: () => void
    icon?: React.ReactNode
}

export function EmptyState({
    title = 'No data',
    message = 'There are no items to display',
    buttonText,
    onAction,
    icon = <Inbox className="h-12 w-12" />,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 p-12 text-center">
            <div className="mb-4 text-muted-foreground">{icon}</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
            <p className="mb-6 text-sm text-muted-foreground">{message}</p>
            {buttonText && onAction && (
                <Button onClick={onAction} variant="default" size="sm">
                    {buttonText}
                </Button>
            )}
        </div>
    )
}

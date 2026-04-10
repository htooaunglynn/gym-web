import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
    title?: string
    message: string
    onRetry?: () => void
    showRetry?: boolean
}

export function ErrorState({ title = 'Error', message, onRetry, showRetry = true }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
            <p className="mb-6 text-sm text-muted-foreground">{message}</p>
            {showRetry && onRetry && (
                <Button onClick={onRetry} variant="outline" size="sm">
                    Try Again
                </Button>
            )}
        </div>
    )
}

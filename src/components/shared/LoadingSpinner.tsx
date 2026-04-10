import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    fullScreen?: boolean
}

export function LoadingSpinner({ size = 'md', fullScreen = false }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16',
    }

    const spinner = (
        <div className="flex items-center justify-center">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        </div>
    )

    if (fullScreen) {
        return (
            <div className="flex h-screen items-center justify-center">
                {spinner}
            </div>
        )
    }

    return spinner
}

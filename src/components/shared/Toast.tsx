import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
    id: string
    type: ToastType
    message: string
    duration?: number
    onClose: (id: string) => void
}

const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
}

const bgMap: Record<ToastType, string> = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
}

const iconColorMap: Record<ToastType, string> = {
    success: 'text-emerald-600',
    error: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
}

export function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        if (duration === 0) return

        const timer = setTimeout(() => {
            setIsExiting(true)
            setTimeout(() => onClose(id), 300)
        }, duration)

        return () => clearTimeout(timer)
    }, [id, duration, onClose])

    return (
        <div
            className={`
        flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg
        transition-all duration-300
        ${bgMap[type]}
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
        >
            <div className={iconColorMap[type]}>{iconMap[type]}</div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => {
                    setIsExiting(true)
                    setTimeout(() => onClose(id), 300)
                }}
                className="ml-2 hover:opacity-70"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

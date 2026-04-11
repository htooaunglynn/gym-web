import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ToastType } from '@/components/shared/Toast'

export interface ToastMessage {
    id: string
    type: ToastType
    message: string
    duration?: number
    actionLabel?: string
    onAction?: () => void
}

interface ToastContextType {
    toasts: ToastMessage[]
    addToast: (message: string, type: ToastType, duration?: number) => void
    addActionToast: (message: string, type: ToastType, actionLabel: string, onAction: () => void, duration?: number) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([])

    const addToast = useCallback((message: string, type: ToastType, duration = 5000) => {
        const id = `${Date.now()}-${Math.random()}`
        setToasts((prev) => [...prev, { id, type, message, duration }])
    }, [])

    const addActionToast = useCallback(
        (message: string, type: ToastType, actionLabel: string, onAction: () => void, duration = 0) => {
            const id = `${Date.now()}-${Math.random()}`
            setToasts((prev) => [...prev, { id, type, message, duration, actionLabel, onAction }])
        },
        []
    )

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, addActionToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

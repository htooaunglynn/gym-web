import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/shared/Toast'
import type { ToastMessage } from '@/hooks/useToast'

export default function ToastContainer() {
    const { toasts, removeToast } = useToast()

    return (
        <div className="fixed bottom-0 right-0 z-50 flex w-full max-w-md flex-col gap-2 p-4 sm:bottom-4 sm:right-4">
            {toasts.map((toast: ToastMessage) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    duration={toast.duration}
                    actionLabel={toast.actionLabel}
                    onAction={toast.onAction}
                    onClose={removeToast}
                />
            ))}
        </div>
    )
}

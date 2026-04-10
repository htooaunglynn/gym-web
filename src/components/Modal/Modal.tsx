import type { ReactNode } from 'react'

interface ModalProps {
    open: boolean
    title?: string
    children: ReactNode
}

export default function Modal({ open, title, children }: ModalProps) {
    if (!open) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                {title ? <h2 className="mb-4 text-lg font-semibold">{title}</h2> : null}
                {children}
            </div>
        </div>
    )
}

import { BrowserRouter } from 'react-router'
import { ToastProvider } from '@/hooks/useToast'
import { AuthProvider } from '@/features/auth/hooks/useAuthContext'
import ToastContainer from '@/components/shared/ToastContainer'
import AppRouter from '@/routes'

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <AppRouter />
                    <ToastContainer />
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    )
}

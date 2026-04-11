import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { AppError } from '@/services'
import { useToast } from '@/hooks/useToast'
import { copy } from '@/constants/copy'
import { getRoleDashboardPath } from '@/utils/role'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login, isAuthenticated, isLoading, dashboardPath } = useAuth()
    const { addToast } = useToast()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    if (!isLoading && isAuthenticated && dashboardPath) {
        return <Navigate to={dashboardPath} replace />
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!email) newErrors.email = copy.errors.required
        if (!password) newErrors.password = copy.errors.required
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            const role = await login(email, password)
            addToast('Logged in successfully', 'success')
            navigate(getRoleDashboardPath(role), { replace: true })
        } catch (error: unknown) {
            addToast(getErrorMessage(error, copy.auth.loginError), 'error')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{copy.auth.login}</CardTitle>
                    <CardDescription>{copy.auth.haveAccount}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{copy.auth.email}</label>
                            <Input
                                type="email"
                                placeholder={copy.auth.email}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (errors.email) setErrors({ ...errors, email: '' })
                                }}
                                disabled={isLoading}
                                className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{copy.auth.password}</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (errors.password) setErrors({ ...errors, password: '' })
                                }}
                                disabled={isLoading}
                                className={errors.password ? 'border-destructive' : ''}
                            />
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {copy.common.loading}
                                </>
                            ) : (
                                copy.auth.signIn
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {copy.auth.noAccount}{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/auth/register')}
                                className="font-medium text-primary hover:underline"
                            >
                                {copy.auth.signUp}
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (isAppError(error)) {
        return error.userMessage
    }

    return fallback
}

function isAppError(error: unknown): error is AppError {
    return typeof error === 'object' && error !== null && 'userMessage' in error
}

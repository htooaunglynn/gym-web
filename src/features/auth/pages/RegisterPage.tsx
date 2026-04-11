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

export default function RegisterPage() {
    const navigate = useNavigate()
    const { registerMember, isAuthenticated, isLoading, dashboardPath } = useAuth()
    const { addToast } = useToast()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    if (!isLoading && isAuthenticated && dashboardPath) {
        return <Navigate to={dashboardPath} replace />
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.firstName) newErrors.firstName = copy.errors.required
        if (!formData.lastName) newErrors.lastName = copy.errors.required
        if (!formData.email) {
            newErrors.email = copy.errors.required
        } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = copy.errors.invalidEmail
        }
        if (!formData.phone) {
            newErrors.phone = copy.errors.required
        } else if (!formData.phone.match(/^[+\d\s\-()]+$/)) {
            newErrors.phone = copy.errors.invalidPhone
        }
        if (!formData.password) {
            newErrors.password = copy.errors.required
        } else if (formData.password.length < 8) {
            newErrors.password = copy.errors.passwordTooShort
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = copy.errors.passwordMismatch
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            const role = await registerMember(
                formData.email,
                formData.phone,
                formData.firstName,
                formData.lastName,
                formData.password
            )
            addToast(copy.auth.registerSuccess, 'success')
            navigate(getRoleDashboardPath(role), { replace: true })
        } catch (error: unknown) {
            addToast(getErrorMessage(error, copy.auth.registerError), 'error')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{copy.auth.register}</CardTitle>
                    <CardDescription>{copy.auth.haveAccount}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{copy.auth.firstName}</label>
                                <Input
                                    name="firstName"
                                    placeholder={copy.auth.firstName}
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={errors.firstName ? 'border-destructive' : ''}
                                />
                                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{copy.auth.lastName}</label>
                                <Input
                                    name="lastName"
                                    placeholder={copy.auth.lastName}
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={errors.lastName ? 'border-destructive' : ''}
                                />
                                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{copy.auth.email}</label>
                            <Input
                                name="email"
                                type="email"
                                placeholder={copy.auth.email}
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{copy.auth.phone}</label>
                            <Input
                                name="phone"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={errors.phone ? 'border-destructive' : ''}
                            />
                            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{copy.auth.password}</label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={errors.password ? 'border-destructive' : ''}
                            />
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{copy.auth.confirmPassword}</label>
                            <Input
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={errors.confirmPassword ? 'border-destructive' : ''}
                            />
                            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {copy.common.loading}
                                </>
                            ) : (
                                copy.auth.signUp
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {copy.auth.haveAccount}{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/auth/login')}
                                className="font-medium text-primary hover:underline"
                            >
                                {copy.auth.signIn}
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

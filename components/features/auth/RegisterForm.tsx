"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { registerMemberSchema, type RegisterMemberFormValues } from "@/lib/validators";
import { registerMember } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { ROUTES } from "@/config/routes";

export function RegisterForm() {
    const router = useRouter();
    const { setAuth } = useAuth();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterMemberFormValues>({
        resolver: zodResolver(registerMemberSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (values: RegisterMemberFormValues) =>
            registerMember({
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                password: values.password,
            }),
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken);
            toast.success("Account created! Welcome.");
            router.push(ROUTES.DASHBOARD);
        },
        onError: (err: Error) => {
            toast.error(err.message ?? "Registration failed. Please try again.");
        },
    });

    return (
        <form
            onSubmit={handleSubmit((values) => mutate(values))}
            noValidate
            className="space-y-5"
        >
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="First name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Alex"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                />
                <Input
                    label="Last name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Johnson"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                />
            </div>

            <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
            />

            <Input
                label="Phone (optional)"
                type="tel"
                autoComplete="tel"
                placeholder="+1 555 000-1234"
                error={errors.phone?.message}
                {...register("phone")}
            />

            <div className="relative">
                <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 8 chars with uppercase & number"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-[2.15rem] text-on-surface-variant hover:text-on-surface transition-default"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="w-full mt-2"
            >
                Create account
            </Button>
        </form>
    );
}

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { login } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { ROUTES } from "@/config/routes";

export function LoginForm() {
    const router = useRouter();
    const { setAuth } = useAuth();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { accountType: "USER" },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken);
            toast.success("Welcome back!");
            router.push(ROUTES.DASHBOARD);
        },
        onError: (err: Error) => {
            toast.error(err.message ?? "Invalid email or password.");
        },
    });

    return (
        <form
            onSubmit={handleSubmit((values) => mutate(values))}
            noValidate
            className="space-y-5"
        >
            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-1">
                    Account type
                </label>
                <select
                    {...register("accountType")}
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                >
                    <option value="USER">Staff / Admin</option>
                    <option value="MEMBER">Member</option>
                </select>
            </div>

            <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
            />

            <div className="relative">
                <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
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
                Sign in
            </Button>
        </form>
    );
}

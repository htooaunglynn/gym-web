import React from "react";
import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { ROUTES } from "@/config/routes";

export default function LoginPage() {
    return (
        <Card variant="elevated">
            <div className="text-center mb-6">
                <h1 className="display-lg text-on-surface">Welcome back</h1>
                <p className="text-body-md text-on-surface-variant mt-2">
                    Sign in to your account to continue
                </p>
            </div>

            <LoginForm />

            <p className="text-center text-body-sm text-on-surface-variant mt-6">
                New member?{" "}
                <Link
                    href={ROUTES.REGISTER}
                    className="text-primary font-semibold hover:underline"
                >
                    Create an account
                </Link>
            </p>
        </Card>
    );
}

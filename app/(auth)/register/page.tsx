import React from "react";
import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { ROUTES } from "@/config/routes";

export default function RegisterPage() {
    return (
        <Card variant="elevated">
            <div className="text-center mb-6">
                <h1 className="display-lg text-on-surface">Create account</h1>
                <p className="text-body-md text-on-surface-variant mt-2">
                    Join GymHub today
                </p>
            </div>

            <RegisterForm />

            <p className="text-center text-body-sm text-on-surface-variant mt-6">
                Already have an account?{" "}
                <Link
                    href={ROUTES.LOGIN}
                    className="text-primary font-semibold hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </Card>
    );
}

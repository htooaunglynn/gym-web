"use client";

import dynamic from "next/dynamic";

export const LoginFormClient = dynamic(
    () => import("@/components/auth/LoginForm").then((mod) => mod.LoginForm),
    {
        ssr: false,
    },
);

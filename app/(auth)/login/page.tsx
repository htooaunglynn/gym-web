"use client";

import React from "react";
import { Card } from "@/components/shared/Card";

export default function LoginPage() {
  return (
    <Card variant="elevated">
      <div className="text-center mb-6">
        <h1 className="display-lg text-on-surface">Welcome to GymHub</h1>
        <p className="text-body-md text-on-surface-variant mt-2">
          Sign in to your account to continue
        </p>
      </div>

      <p className="text-center text-on-surface-variant">
        Login page coming soon...
      </p>
    </Card>
  );
}

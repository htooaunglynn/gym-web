"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/shared/Card";

export default function DashboardPage() {
  const { user, userRole } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-lg text-on-surface">Dashboard</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Welcome back, {user?.firstName}!
        </p>
      </div>

      <Card variant="elevated">
        <div className="text-center py-12">
          <p className="text-body-md text-on-surface-variant mb-4">
            You are logged in as: <span className="font-semibold">{userRole}</span>
          </p>
          <p className="text-body-md text-on-surface-variant">
            Dashboard content coming soon...
          </p>
        </div>
      </Card>
    </div>
  );
}

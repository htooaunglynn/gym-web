"use client";

import React, { createContext, useContext } from "react";
import type { Tenant } from "@gym/types";

const TenantContext = createContext<Tenant | null>(null);

export function TenantProvider({
  children,
  tenant,
}: {
  children: React.ReactNode;
  tenant: Tenant;
}) {
  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used inside TenantProvider");
  }
  return ctx;
}

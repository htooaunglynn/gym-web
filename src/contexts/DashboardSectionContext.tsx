"use client";

import { createContext, useContext, useMemo, useState } from "react";

export const DASHBOARD_SECTIONS = [
  "overview",
  "activity",
  "manage",
  "programs",
  "account",
  "reports",
] as const;

export type DashboardSection = (typeof DASHBOARD_SECTIONS)[number];

interface DashboardSectionContextValue {
  section: DashboardSection;
  setSection: (next: DashboardSection) => void;
}

const DashboardSectionContext =
  createContext<DashboardSectionContextValue | null>(null);

export function DashboardSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [section, setSection] = useState<DashboardSection>("overview");

  const value = useMemo(
    () => ({ section, setSection }),
    [section],
  );

  return (
    <DashboardSectionContext.Provider value={value}>
      {children}
    </DashboardSectionContext.Provider>
  );
}

export function useDashboardSection(): DashboardSectionContextValue {
  const context = useContext(DashboardSectionContext);
  if (!context) {
    throw new Error(
      "useDashboardSection must be used within a DashboardSectionProvider",
    );
  }
  return context;
}

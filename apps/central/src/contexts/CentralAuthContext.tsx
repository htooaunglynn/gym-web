"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { JwtPayload } from "@gym/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CentralAuthUser {
  sub: string;
  email: string;
}

interface CentralAuthContextValue {
  user: CentralAuthUser | null;
  /** In-memory only — never written to localStorage */
  accessToken: string | null;
  setSession: (token: string) => void;
  clearSession: () => void;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CentralAuthContext = createContext<CentralAuthContextValue | null>(null);

/** Decode JWT payload without verification (verification is backend's job) */
function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded)) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CentralAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /** Access token lives ONLY in React state — never localStorage */
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<CentralAuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // On mount mark hydrated (no stored token to restore — httpOnly cookie
  // handles the refresh flow; the access token is obtained post-mount via
  // a /auth/refresh call if the cookie is valid).
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const setSession = useCallback((token: string) => {
    const payload = decodeJwt(token);
    if (!payload) return;
    setAccessToken(token);
    setUser({ sub: payload.sub, email: payload.email });
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const value = useMemo<CentralAuthContextValue>(
    () => ({
      user,
      accessToken,
      setSession,
      clearSession,
      isAuthenticated,
      isHydrated,
    }),
    [user, accessToken, setSession, clearSession, isAuthenticated, isHydrated],
  );

  return (
    <CentralAuthContext.Provider value={value}>
      {children}
    </CentralAuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCentralAuth(): CentralAuthContextValue {
  const ctx = useContext(CentralAuthContext);
  if (!ctx) {
    throw new Error("useCentralAuth must be used within CentralAuthProvider");
  }
  return ctx;
}

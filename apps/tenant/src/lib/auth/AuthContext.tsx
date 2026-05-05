"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { setApiContext, silentRefreshApi } from "../api/client";
import { jwtDecode } from "jwt-decode";
import type { GlobalRole } from "@gym/types";

export interface JwtPayload {
  sub: string;
  email: string;
  role: GlobalRole;
  tenantId?: string;
  exp: number;
}

interface AuthState {
  user: JwtPayload | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  silentRefresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const logout = useCallback(async () => {
    try {
      await fetch("/api/tenant/auth/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
    setApiContext(null, () => {});
  }, []);

  const silentRefresh = useCallback(async () => {
    try {
      const res = await silentRefreshApi();
      const token = res.data?.accessToken;
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        setState({
          user: decoded,
          accessToken: token,
          isLoading: false,
          isAuthenticated: true,
        });
        setApiContext(token, logout);
        return;
      }
      throw new Error("No token returned");
    } catch (err) {
      setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
      setApiContext(null, logout);
    }
  }, [logout]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/tenant/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 401) throw new Error("Invalid credentials");
    if (res.status === 403) throw new Error("Account suspended");
    if (res.status === 429) throw new Error("Too many attempts. Try again in 10 minutes.");
    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    const token = data.data?.accessToken;
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      setState({
        user: decoded,
        accessToken: token,
        isLoading: false,
        isAuthenticated: true,
      });
      setApiContext(token, logout);
    } else {
      throw new Error("Invalid token format");
    }
  };

  useEffect(() => {
    silentRefresh();
  }, [silentRefresh]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, silentRefresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { setApiContext, silentRefreshApi } from "../api/client";

export interface CentralJwtPayload {
  sub: string;
  email: string;
  role: "superadmin";
  exp: number;
}

interface CentralAuthState {
  user: CentralJwtPayload | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface CentralAuthContextType extends CentralAuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  silentRefresh: () => Promise<void>;
}

const CentralAuthContext = createContext<CentralAuthContextType | null>(null);

export function CentralAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CentralAuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const logout = useCallback(async () => {
    try {
      await fetch("/api/central/auth/logout", { method: "POST" });
    } catch (e) {}
    setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
    setApiContext(null, () => {});
  }, []);

  const silentRefresh = useCallback(async () => {
    try {
      const res = await silentRefreshApi();
      const token = res.data?.accessToken;
      if (token) {
        const decoded = jwtDecode<CentralJwtPayload>(token);
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
    const res = await fetch("/api/central/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 401) throw new Error("Invalid credentials");
    if (res.status === 429) throw new Error("Too many attempts. Try again in 10 minutes.");
    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    const token = data.data?.accessToken;
    if (token) {
      const decoded = jwtDecode<CentralJwtPayload>(token);
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
    <CentralAuthContext.Provider value={{ ...state, login, logout, silentRefresh }}>
      {children}
    </CentralAuthContext.Provider>
  );
}

export function useCentralAuth() {
  const ctx = useContext(CentralAuthContext);
  if (!ctx) throw new Error("useCentralAuth must be used within CentralAuthProvider");
  return ctx;
}

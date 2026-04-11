"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { User, Member, UserRole } from "@/types/auth";
import { ACCESS_TOKEN_KEY, CURRENT_USER_KEY } from "@/lib/constants";

const LEGACY_USER_KEY = "user";

function isStoredUser(value: unknown): value is User | Member {
    if (!value || typeof value !== "object") {
        return false;
    }

    const obj = value as Record<string, unknown>;
    return typeof obj.id === "string"
        && typeof obj.email === "string"
        && typeof obj.firstName === "string"
        && typeof obj.lastName === "string";
}

function parseStoredUser(raw: string | null): User | Member | null {
    if (!raw) {
        return null;
    }

    try {
        const parsed: unknown = JSON.parse(raw);
        return isStoredUser(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

interface AuthContextType {
    user: (User | Member) | null;
    token: string | null;
    isAuthenticated: boolean;
    userRole: UserRole | null;
    setAuth: (user: User | Member, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<(User | Member) | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const storedUserRaw = localStorage.getItem(CURRENT_USER_KEY) ?? localStorage.getItem(LEGACY_USER_KEY);
        const parsedUser = parseStoredUser(storedUserRaw);

        if (storedToken && parsedUser) {
            setToken(storedToken);
            setUser(parsedUser);
        } else if (storedToken || storedUserRaw) {
            // Clear invalid or partial auth cache to avoid hydration/runtime errors.
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(CURRENT_USER_KEY);
            localStorage.removeItem(LEGACY_USER_KEY);
        }

        setIsLoading(false);
    }, []);

    const setAuth = useCallback((newUser: User | Member, newToken: string) => {
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        localStorage.removeItem(LEGACY_USER_KEY);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(LEGACY_USER_KEY);
    }, []);

    const userRole = user && "role" in user ? user.role : null;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                userRole,
                setAuth,
                logout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

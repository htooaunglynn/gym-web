"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { User, Member, UserRole } from "@/types/auth";

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
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
            }
        }

        setIsLoading(false);
    }, []);

    const setAuth = useCallback((newUser: User | Member, newToken: string) => {
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem("accessToken", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
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

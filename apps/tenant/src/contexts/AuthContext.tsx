"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    AuthService,
    AuthUser,
    RolePermission,
} from "@/services/auth.service";

// Re-export all auth-service types so consumers can import from a single location
export type {
    AuthUser,
    RolePermission,
    GlobalRole,
    PermissionFeature,
    PermissionAction,
    PermissionStage,
} from "@/services/auth.service";

const ACTIVE_BRANCH_STORAGE_KEY = "activeBranchId";

export interface AuthContextValue {
    user: AuthUser | null;
    activeBranchId: string | null;
    setActiveBranchId: (id: string | null) => void;
    login: (token: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    permissions: RolePermission[];
    setPermissions: (permissions: RolePermission[]) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStoredActiveBranchId(user: AuthUser | null): string | null {
    if (typeof window === "undefined") return user?.branchId ?? null;

    const storedBranchId = localStorage.getItem(ACTIVE_BRANCH_STORAGE_KEY);
    if (user?.isAdmin) {
        return storedBranchId ?? null;
    }

    return user?.branchId ?? null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [activeBranchId, setActiveBranchIdState] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<RolePermission[]>([]);
    const [hydrated, setHydrated] = useState(false);

    const refreshPermissions = useCallback(async (branchId?: string | null) => {
        const perms = await AuthService.fetchPermissions(branchId);
        setPermissions(perms);
    }, []);

    // On mount: restore auth state
    useEffect(() => {
        const restoredUser = AuthService.getStoredUser();
        const restoredBranchId = getStoredActiveBranchId(restoredUser);
        setUser(restoredUser);
        setActiveBranchIdState(restoredBranchId);
        setHydrated(true);
    }, []);

    // Once hydrated, fetch permissions
    useEffect(() => {
        if (!hydrated) return;
        const authUser = AuthService.getStoredUser();
        if (!authUser) return;

        void refreshPermissions(activeBranchId);
    }, [hydrated, refreshPermissions, activeBranchId]);

    const login = useCallback(async (token: string) => {
        const authUser = await AuthService.login(token);
        if (authUser) {
            const nextBranchId = authUser.isAdmin
                ? getStoredActiveBranchId(authUser)
                : authUser.branchId;
            
            setUser(authUser);
            setActiveBranchIdState(nextBranchId);

            if (nextBranchId) {
                localStorage.setItem(ACTIVE_BRANCH_STORAGE_KEY, nextBranchId);
            } else {
                localStorage.removeItem(ACTIVE_BRANCH_STORAGE_KEY);
            }

            await refreshPermissions(nextBranchId);
        }
    }, [refreshPermissions]);

    const logout = useCallback(() => {
        AuthService.logout();
    }, []);

    const setActiveBranchId = useCallback(
        (id: string | null) => {
            if (user?.isAdmin) {
                if (id) {
                    localStorage.setItem(ACTIVE_BRANCH_STORAGE_KEY, id);
                } else {
                    localStorage.removeItem(ACTIVE_BRANCH_STORAGE_KEY);
                }
                setActiveBranchIdState(id);
            }
        },
        [user],
    );

    const isAuthenticated = useMemo(() => !!user, [user]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            activeBranchId,
            setActiveBranchId,
            login,
            logout,
            isAuthenticated,
            permissions,
            setPermissions,
        }),
        [
            user,
            activeBranchId,
            setActiveBranchId,
            login,
            logout,
            isAuthenticated,
            permissions,
        ],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}


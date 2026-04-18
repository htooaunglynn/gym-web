"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { ApiClientError, apiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GlobalRole = "ADMIN" | "BRANCH_ADMIN" | "STAFF" | "HR" | "MANAGER";

export type PermissionFeature =
    | "BRANCHES"
    | "USERS"
    | "MEMBERS"
    | "TRAINERS"
    | "ATTENDANCE"
    | "EQUIPMENT"
    | "INVENTORY_MOVEMENTS"
    | "MEMBERSHIP_PLANS"
    | "MEMBER_SUBSCRIPTIONS"
    | "PRODUCTS"
    | "PRODUCT_SALES"
    | "ROLE_PERMISSIONS"
    | "BRANCH_USER_ASSIGNMENTS"
    | "SUBSCRIPTION_APPROVALS";

export type PermissionAction =
    | "VIEW"
    | "CREATE_UPDATE"
    | "DELETE"
    | "MANAGE"
    | "APPROVE";

export interface RolePermission {
    feature: PermissionFeature;
    actions: PermissionAction[];
}

interface CurrentUserPermissionMatrix {
    permissions: RolePermission[];
}

export interface AuthUser {
    sub: string;
    email: string;
    globalRole: GlobalRole;
    branchId: string | null;
}

interface JwtPayload {
    sub: string;
    email: string;
    globalRole: GlobalRole;
    branchId: string | null;
    iat: number;
    exp: number;
}

export interface AuthContextValue {
    user: AuthUser | null;
    activeBranchId: string | null;
    setActiveBranchId: (id: string) => void;
    login: (token: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    permissions: RolePermission[];
    setPermissions: (permissions: RolePermission[]) => void;
}

// ─── JWT Decode ───────────────────────────────────────────────────────────────

/**
 * Manually decode a JWT payload without external libraries.
 * Returns null if the token is invalid or expired.
 */
function decodeJwt(token: string): JwtPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        // Base64url decode the payload
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(
            base64.length + ((4 - (base64.length % 4)) % 4),
            "=",
        );
        const jsonStr = atob(padded);
        const payload = JSON.parse(jsonStr) as JwtPayload;

        // Check expiry
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

function payloadToUser(payload: JwtPayload): AuthUser {
    return {
        sub: payload.sub,
        email: payload.email,
        globalRole: payload.globalRole,
        branchId: payload.branchId,
    };
}

function getStoredAuthUser(): AuthUser | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const payload = decodeJwt(token);
    if (!payload) {
        localStorage.removeItem("accessToken");
        return null;
    }

    return payloadToUser(payload);
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
    const [activeBranchId, setActiveBranchIdState] = useState<string | null>(
        () => getStoredAuthUser()?.branchId ?? null,
    );
    const [permissions, setPermissions] = useState<RolePermission[]>([]);

    const refreshPermissions = useCallback(async (branchId?: string | null) => {
        try {
            const data = await apiClient<CurrentUserPermissionMatrix>(
                "/permissions/me",
                {
                    suppressErrorToastForStatuses: [403],
                    params: branchId ? { branchId } : undefined,
                },
            );
            if (Array.isArray(data.permissions)) {
                setPermissions(data.permissions);
                return;
            }
            setPermissions([]);
        } catch (error) {
            if (error instanceof ApiClientError && error.status === 403) {
                // Member accounts do not have role-permission matrix access.
                setPermissions([]);
                return;
            }
            setPermissions([]);
        }
    }, []);

    // On mount, restore permissions for authenticated staff/admin accounts.
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        void Promise.resolve().then(() => refreshPermissions(activeBranchId));
    }, [activeBranchId, refreshPermissions]);

    const login = useCallback(async (token: string) => {
        localStorage.setItem("accessToken", token);
        const payload = decodeJwt(token);
        if (payload) {
            const authUser = payloadToUser(payload);
            setUser(authUser);
            setActiveBranchIdState(authUser.branchId);
            await refreshPermissions(authUser.branchId);
            return;
        }

        await refreshPermissions();
    }, [refreshPermissions]);

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
        setActiveBranchIdState(null);
        setPermissions([]);
        window.location.href = "/login";
    }, []);

    const setActiveBranchId = useCallback(
        (id: string) => {
            // Only ADMIN users can switch branches
            if (user?.globalRole === "ADMIN") {
                setActiveBranchIdState(id);
            }
        },
        [user],
    );

    const isAuthenticated = useMemo(() => {
        if (!user) return false;
        const token = localStorage.getItem("accessToken");
        if (!token) return false;
        const payload = decodeJwt(token);
        return payload !== null;
    }, [user]);

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

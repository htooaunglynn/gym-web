"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

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

    // On mount, restore permissions from GET /auth/me when a token exists
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        fetch("http://localhost:3000/api/v1/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.ok)
                    return res.json() as Promise<{ permissions?: RolePermission[] }>;
                return null;
            })
            .then((data) => {
                if (data && Array.isArray(data.permissions)) {
                    setPermissions(data.permissions);
                }
            })
            .catch(() => {
                // Non-fatal: permissions will be empty
            });
    }, []);

    const login = useCallback(async (token: string) => {
        localStorage.setItem("accessToken", token);
        const payload = decodeJwt(token);
        if (payload) {
            const authUser = payloadToUser(payload);
            setUser(authUser);
            setActiveBranchIdState(authUser.branchId);
        }

        // Fetch permission matrix from GET /auth/me
        try {
            const res = await fetch("http://localhost:3000/api/v1/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                const data = (await res.json()) as { permissions?: RolePermission[] };
                if (Array.isArray(data.permissions)) {
                    setPermissions(data.permissions);
                }
            }
        } catch {
            // Non-fatal: permissions will be empty, guards will deny access
        }
    }, []);

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

import { apiClient } from "@/lib/apiClient";

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

export type PermissionStage = 0 | 1 | 2 | 3 | 4;

export interface RolePermission {
    feature: PermissionFeature;
    actions: PermissionAction[];
    permissionStage?: PermissionStage;
}

export interface AuthUser {
    sub: string;
    email: string;
    role: GlobalRole | null;
    globalRole: GlobalRole;
    branchId: string | null;
    isAdmin: boolean;
}

interface JwtPayload {
    sub: string;
    email: string;
    role?: GlobalRole;
    globalRole: GlobalRole;
    branchId: string | null;
    isAdmin?: boolean;
    iat: number;
    exp: number;
}

interface CurrentUserPermissionMatrix {
    permissions: RolePermission[];
}

const ACCESS_TOKEN_KEY = "accessToken";

export const AuthService = {
    /**
     * Manually decode a JWT payload without external libraries.
     */
    decodeJwt(token: string): JwtPayload | null {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) return null;

            const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const padded = base64.padEnd(
                base64.length + ((4 - (base64.length % 4)) % 4),
                "=",
            );
            const jsonStr = atob(padded);
            const payload = JSON.parse(jsonStr) as JwtPayload;

            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                return null;
            }

            return payload;
        } catch {
            return null;
        }
    },

    payloadToUser(payload: JwtPayload): AuthUser {
        return {
            sub: payload.sub,
            email: payload.email,
            role: payload.role ?? null,
            globalRole: payload.globalRole,
            branchId: payload.branchId,
            isAdmin: payload.isAdmin === true || payload.globalRole === "ADMIN",
        };
    },

    getStoredToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    setStoredToken(token: string) {
        if (typeof window === "undefined") return;
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    removeStoredToken() {
        if (typeof window === "undefined") return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },

    getStoredUser(): AuthUser | null {
        const token = this.getStoredToken();
        if (!token) return null;

        const payload = this.decodeJwt(token);
        if (!payload) {
            this.removeStoredToken();
            return null;
        }

        return this.payloadToUser(payload);
    },

    async fetchPermissions(branchId?: string | null): Promise<RolePermission[]> {
        try {
            const data = await apiClient<CurrentUserPermissionMatrix>(
                "/permissions/me",
                {
                    suppressErrorToastForStatuses: [403],
                    params: branchId ? { branchId } : undefined,
                },
            );
            return Array.isArray(data.permissions) ? data.permissions : [];
        } catch {
            return [];
        }
    },

    async login(token: string): Promise<AuthUser | null> {
        this.setStoredToken(token);
        const payload = this.decodeJwt(token);
        return payload ? this.payloadToUser(payload) : null;
    },

    logout() {
        this.removeStoredToken();
        localStorage.removeItem("activeBranchId");
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    },
};

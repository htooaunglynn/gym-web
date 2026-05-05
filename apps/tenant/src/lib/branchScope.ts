import type { AuthUser } from "@/contexts/AuthContext";

export const ALL_BRANCHES_READONLY_MESSAGE =
    "Viewing all branches is read-only. Select a single branch to create, update, approve, or delete records.";

export function isAllBranchesScope(
    user: AuthUser | null,
    activeBranchId: string | null,
): boolean {
    return user?.isAdmin === true && activeBranchId === null;
}

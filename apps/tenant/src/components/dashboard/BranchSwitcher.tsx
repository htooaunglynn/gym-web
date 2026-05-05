"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, normalizeListResponse } from "@/lib/apiClient";

const ALL_BRANCHES_OPTION_VALUE = "__all_branches__";

interface Branch {
    id: string;
    name: string;
}

/** Normalise API shape — handles both `id` and `_id` (Mongoose) */
function normaliseBranch(raw: Record<string, unknown>): Branch {
    return {
        id: (raw.id ?? raw._id ?? "") as string,
        name: (raw.name ?? "") as string,
    };
}

/**
 * ADMIN-only branch switcher rendered in the TopHeader.
 * Fetches GET /branches via apiClient and calls setActiveBranchId on
 * selection (Requirements 3.10, 17.8).
 *
 * Returns null for non-ADMIN users so it can be rendered unconditionally.
 */
export function BranchSwitcher() {
    const { user, activeBranchId, setActiveBranchId } = useAuth();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const mounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false,
    );

    // Only ADMIN users see the switcher
    const isAdmin = user?.globalRole === "ADMIN";

    // Removed the useEffect that sets mounted state

    useEffect(() => {
        if (!isAdmin) return;

        const fetchBranches = async () => {
            setIsLoading(true);
            try {
                // The endpoint may return an array or a paginated response
                const res = await apiClient<
                    Record<string, unknown>[] | { data: Record<string, unknown>[] }
                >("/branches");
                const raw = normalizeListResponse(res).data;
                setBranches(raw.map(normaliseBranch));
            } catch {
                // apiClient already shows an error toast
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
    }, [isAdmin]);

    if (!mounted || !isAdmin) return null;

    return (
        <div className="relative flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400 shrink-0" />

            {isLoading ? (
                <div className="h-4 w-28 bg-[#e5e5e0] animate-pulse rounded-full" />
            ) : (
                <div className="relative">
                    <select
                        value={activeBranchId ?? ALL_BRANCHES_OPTION_VALUE}
                        onChange={(e) => {
                            if (e.target.value === ALL_BRANCHES_OPTION_VALUE) {
                                setActiveBranchId(null);
                                return;
                            }

                            setActiveBranchId(e.target.value);
                        }}
                        className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#435ee5] focus:border-transparent cursor-pointer transition-colors"
                        aria-label="Switch active branch"
                    >
                        <option value={ALL_BRANCHES_OPTION_VALUE}>All branches</option>
                        {branches.map((branch, index) => (
                            <option key={branch.id || index} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                </div>
            )}
        </div>
    );
}

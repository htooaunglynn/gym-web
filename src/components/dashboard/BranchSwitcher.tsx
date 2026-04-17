"use client";

import { useState, useEffect } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/apiClient";

interface Branch {
    id: string;
    name: string;
}

/**
 * ADMIN-only branch switcher rendered in the TopHeader.
 * Fetches GET /branches/mine via apiClient and calls setActiveBranchId on
 * selection (Requirements 3.10, 17.8).
 *
 * Returns null for non-ADMIN users so it can be rendered unconditionally.
 */
export function BranchSwitcher() {
    const { user, activeBranchId, setActiveBranchId } = useAuth();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Only ADMIN users see the switcher
    const isAdmin = user?.globalRole === "ADMIN";

    useEffect(() => {
        if (!isAdmin) return;

        const fetchBranches = async () => {
            setIsLoading(true);
            try {
                // The endpoint may return an array or a paginated response
                const res = await apiClient<Branch[] | { data: Branch[] }>(
                    "/branches/mine",
                );
                const list = Array.isArray(res) ? res : (res.data ?? []);
                setBranches(list);
            } catch {
                // apiClient already shows an error toast
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
    }, [isAdmin]);

    if (!isAdmin) return null;

    return (
        <div className="relative flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400 shrink-0" />

            {isLoading ? (
                <div className="h-4 w-28 bg-[#e5e5e0] animate-pulse rounded-full" />
            ) : (
                <div className="relative">
                    <select
                        value={activeBranchId ?? ""}
                        onChange={(e) => {
                            if (e.target.value) {
                                setActiveBranchId(e.target.value);
                            }
                        }}
                        className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#435ee5] focus:border-transparent cursor-pointer transition-colors"
                        aria-label="Switch active branch"
                    >
                        {branches.length === 0 && (
                            <option value="" disabled>
                                No branches
                            </option>
                        )}
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
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

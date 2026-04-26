import { useState, useCallback, useEffect } from "react";
import { BranchService } from "@/services/branch.service";
import { Branch } from "@/types/branch";
import { normalizeListResponse, PaginationMeta, PaginationResponse } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";

const DEFAULT_META: PaginationMeta = {
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
};

export function useBranches(page = 1, limit = 20) {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchBranches = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await BranchService.getAll({ page, limit }) as PaginationResponse<Branch> | { data: Branch[] } | Branch[];
            const normalized = normalizeListResponse(response);
            setBranches(normalized.data);
            setMeta(normalized.meta ?? DEFAULT_META);
        } catch {
            // Error handling is managed by apiClient
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const deleteBranch = async (id: string) => {
        try {
            await BranchService.delete(id);
            showToast("Branch removed successfully", "success");
            await fetchBranches();
            return true;
        } catch {
            return false;
        }
    };

    return {
        branches,
        meta,
        isLoading,
        refresh: fetchBranches,
        deleteBranch,
    };
}

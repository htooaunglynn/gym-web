import { useState, useCallback, useEffect } from "react";
import { TrainerService } from "@/services/trainer.service";
import { Trainer } from "@/types/trainer";
import { PaginationMeta } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_META: PaginationMeta = {
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
};

export function useTrainers(page = 1, limit = 20) {
    const { activeBranchId } = useAuth();
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchTrainers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await TrainerService.getAll({ page, limit });
            setTrainers(response.data ?? []);
            setMeta(response.meta ?? DEFAULT_META);
        } catch {
            // Error handling managed by apiClient
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, activeBranchId]);

    useEffect(() => {
        setTrainers([]);
        setMeta(DEFAULT_META);
        setIsLoading(true);
    }, [activeBranchId]);

    useEffect(() => {
        fetchTrainers();
    }, [fetchTrainers]);

    const deleteTrainer = async (id: string) => {
        try {
            await TrainerService.delete(id);
            showToast("Trainer removed successfully", "success");
            await fetchTrainers();
            return true;
        } catch {
            return false;
        }
    };

    return {
        trainers,
        meta,
        isLoading,
        refresh: fetchTrainers,
        deleteTrainer,
    };
}

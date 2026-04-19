import { useState, useCallback, useEffect } from "react";
import { MemberService } from "@/services/member.service";
import { Member } from "@/types/member";
import { PaginationMeta } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";

export function useMembers(page = 1, limit = 20) {
    const [members, setMembers] = useState<Member[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({
        totalItems: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await MemberService.getAll({ page, limit });
            setMembers(response.data);
            setMeta(response.meta);
        } catch {
            // Error handling is managed by apiClient/MemberService
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const deleteMember = async (id: string) => {
        try {
            await MemberService.delete(id);
            showToast("Member removed successfully", "success");
            await fetchMembers();
            return true;
        } catch {
            return false;
        }
    };

    const assignTrainer = async (memberId: string, trainerId: string | null) => {
        try {
            await MemberService.assignTrainer(memberId, trainerId);
            showToast("Trainer assigned successfully", "success");
            await fetchMembers();
            return true;
        } catch {
            return false;
        }
    };

    return {
        members,
        meta,
        isLoading,
        refresh: fetchMembers,
        deleteMember,
        assignTrainer,
    };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { PlanModal } from "@/components/dashboard/PlanModal";
import { BranchScopeNotice } from "@/components/shared/BranchScopeNotice";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { useToast } from "@/contexts/ToastContext";
import {
    ALL_BRANCHES_READONLY_MESSAGE,
    isAllBranchesScope,
} from "@/lib/branchScope";
import { Plus } from "lucide-react";
import {
    apiClient,
    normalizeListResponse,
    PaginationResponse,
} from "@/lib/apiClient";
import type { MembershipPlan } from "@/types/membership-plan";

const DEFAULT_META = {
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
};

export default function PlansPage() {
    const { user, activeBranchId } = useAuth();
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [meta, setMeta] = useState(DEFAULT_META);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const handleSort = (newSortBy: string, newSortOrder: "asc" | "desc") => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | undefined>(
        undefined,
    );
    const [confirmDelete, setConfirmDelete] = useState<
        MembershipPlan | undefined
    >(undefined);
    const [isDeleting, setIsDeleting] = useState(false);

    const canEdit = usePermission("MEMBERSHIP_PLANS", "CREATE_UPDATE");
    const canDelete = usePermission("MEMBERSHIP_PLANS", "DELETE");
    const { showToast } = useToast();
    const isAllBranchesMode = isAllBranchesScope(user, activeBranchId);

    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await apiClient<PaginationResponse<MembershipPlan>>(
                "/membership-plans",
                {
                    params: { 
                        page, 
                        limit: 20,
                        sortBy,
                        sortOrder
                    },
                },
            );
            const normalized = normalizeListResponse(result);
            setPlans(normalized.data);
            setMeta(normalized.meta);
        } catch (error) {
            console.error("Failed to fetch plans", error);
        } finally {
            setIsLoading(false);
        }
    }, [activeBranchId, page, sortBy, sortOrder]);

    useEffect(() => {
        setPage(1);
        setPlans([]);
        setMeta(DEFAULT_META);
    }, [activeBranchId]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleDeleteConfirm = async () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        try {
            await apiClient(`/membership-plans/${confirmDelete.id}`, {
                method: "DELETE",
            });
            showToast(`Plan "${confirmDelete.name}" deleted successfully`, "success");
            setConfirmDelete(undefined);
            await fetchPlans();
        } catch {
            // apiClient already shows an error toast
            setConfirmDelete(undefined);
        } finally {
            setIsDeleting(false);
        }
    };

    const columns: ColumnDef<MembershipPlan>[] = [
        {
            header: "Plan Name",
            className: "min-w-[200px]",
            accessor: (row) => (
                <div className="flex flex-col">
                    <span className="text-gray-900 font-bold">{row.name}</span>
                    <span className="text-gray-400 text-xs font-medium truncate max-w-[180px]">
                        {row.description}
                    </span>
                </div>
            ),
            sortKey: "name",
        },
        {
            header: "Amount",
            className: "w-[120px]",
            accessor: (row) => (
                <span className="text-gray-900 font-bold font-mono">
                    ${parseFloat(row.amount.toString()).toFixed(2)}
                </span>
            ),
            sortKey: "amount",
        },
        {
            header: "Billing Cycle",
            className: "w-[140px]",
            accessor: (row) => (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {row.billingCycle}
                </span>
            ),
            sortKey: "billingCycle",
        },
        {
            header: "Features",
            className: "min-w-[260px]",
            accessor: (row) => {
                const visibleFeatures = row.features.slice(0, 2);
                const remainingCount = row.features.length - visibleFeatures.length;

                return (
                    <div className="flex flex-wrap gap-1.5 py-1">
                        {visibleFeatures.map((feature) => (
                            <span
                                key={feature}
                                className="rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#c13b3b]"
                                title={feature}
                            >
                                {feature}
                            </span>
                        ))}
                        {remainingCount > 0 && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                +{remainingCount} more
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Status",
            className: "w-[100px]",
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <span
                        className={`w-2 h-2 rounded-full ${row.isActive ? "bg-[#33D073]" : "bg-gray-300"}`}
                    />
                    <span
                        className={`text-[11px] font-bold uppercase ${row.isActive ? "text-[#33D073]" : "text-gray-400"}`}
                    >
                        {row.isActive ? "Active" : "Hidden"}
                    </span>
                </div>
            ),
            sortKey: "isActive",
        },
    ];

    // Build actions array based on permissions — only include actions the user can perform
    const actions = [
        canEdit && !isAllBranchesMode
            ? {
                label: "Edit Plan",
                onClick: (row: MembershipPlan) => {
                    setSelectedPlan(row);
                    setIsModalOpen(true);
                },
            }
            : null,
        canDelete && !isAllBranchesMode
            ? {
                label: "Delete",
                onClick: (row: MembershipPlan) => setConfirmDelete(row),
                className: "text-red-500",
            }
            : null,
    ].filter(Boolean) as {
        label: string;
        onClick: (row: MembershipPlan) => void;
        className?: string;
    }[];

    return (
        <PermissionGuard feature="MEMBERSHIP_PLANS" action="VIEW">
            <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-tight">
                            Membership Plans
                        </h1>
                        <p className="text-gray-500 font-medium text-sm">
                            Manage your gym&apos;s subscription tiers and pricing structure.
                        </p>
                    </div>
                    <PermissionGuard
                        feature="MEMBERSHIP_PLANS"
                        action="CREATE_UPDATE"
                        fallback={null}
                    >
                        {!isAllBranchesMode ? (
                            <button
                                onClick={() => {
                                    setSelectedPlan(undefined);
                                    setIsModalOpen(true);
                                }}
                                className="bg-[#E84C4C] hover:bg-[#d43f3f] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#E84C4C]/20 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Create Plan
                            </button>
                        ) : null}
                    </PermissionGuard>
                </div>

                <BranchScopeNotice
                    isVisible={isAllBranchesMode}
                    message={ALL_BRANCHES_READONLY_MESSAGE}
                />

                <DataTable
                    columns={columns}
                    data={plans}
                    isLoading={isLoading}
                    sortable={true}
                    onSort={handleSort}
                    actions={actions}
                />

                <PaginationControls
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                />

                <PlanModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchPlans}
                    plan={selectedPlan}
                />

                <ConfirmDialog
                    open={!!confirmDelete}
                    title="Delete Plan"
                    message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
                    confirmLabel="Delete"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDelete(undefined)}
                    isLoading={isDeleting}
                />
            </div>
        </PermissionGuard>
    );
}

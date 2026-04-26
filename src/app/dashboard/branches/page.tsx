"use client";

import { useState } from "react";
import { DataTable } from "@/components/crud/DataTable";
import { BranchModal } from "@/components/crud/BranchModal";
import { AssignUserModal } from "@/components/crud/AssignUserModal";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { useBranches } from "@/hooks/useBranches";
import { BranchesHeader } from "@/components/dashboard/branches/BranchesHeader";
import { Branch } from "@/types/branch";

export default function BranchesPage() {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const { branches, meta, isLoading, deleteBranch, refresh, handleSort } = useBranches(page);

    // Modals state
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(undefined);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignBranchId, setAssignBranchId] = useState<string>("");
    const [confirmDelete, setConfirmDelete] = useState<Branch | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState(false);

    // Permissions
    const canUpdate = usePermission("BRANCHES", "CREATE_UPDATE");
    const canManageAssignments = usePermission("BRANCH_USER_ASSIGNMENTS", "MANAGE");
    const canCreateBranch = user?.globalRole === "ADMIN";
    const canDelete = user?.globalRole === "ADMIN";

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleDeleteConfirm = async () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        const success = await deleteBranch(confirmDelete.id);
        if (success) setConfirmDelete(undefined);
        setIsDeleting(false);
    };

    // ── Column definitions ─────────────────────────────────────────────────────

    const columns = [
        {
            header: "ID",
            accessor: (row: Branch) => (
                <span className="font-mono text-xs text-gray-500">
                    {row.id.slice(0, 8)}…
                </span>
            ),
            sortKey: "id",
        },
        {
            header: "Name",
            accessor: (row: Branch) => (
                <span className="font-semibold text-gray-900">{row.name}</span>
            ),
            sortKey: "name",
        },
        {
            header: "Description",
            accessor: (row: Branch) => (
                <span className="text-gray-500 text-sm truncate max-w-[200px] block">
                    {row.description ?? "—"}
                </span>
            ),
            sortKey: "description",
        },
        {
            header: "City",
            accessor: (row: Branch) => (
                <span className="text-gray-600 text-sm">{row.city ?? "—"}</span>
            ),
            sortKey: "city",
        },
        {
            header: "Township",
            accessor: (row: Branch) => (
                <span className="text-gray-600 text-sm">{row.township ?? "—"}</span>
            ),
            sortKey: "township",
        },
        {
            header: "Assigned Users",
            accessor: (row: Branch) => (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                    {(row as any).users?.length ?? 0}
                </span>
            ),
        },
        {
            header: "Created",
            accessor: (row: Branch) => new Date(row.createdAt).toLocaleDateString(),
            sortKey: "createdAt",
        },
    ];

    return (
        <PermissionGuard feature="BRANCHES" action="VIEW">
            <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
                <BranchesHeader 
                    onAddClick={() => {
                        setSelectedBranch(undefined);
                        setIsBranchModalOpen(true);
                    }}
                    canCreateBranch={canCreateBranch}
                />

                <DataTable
                    columns={columns}
                    data={branches}
                    sortable={true}
                    onSort={handleSort}
                    actions={[
                        ...(canUpdate
                            ? [
                                {
                                    label: "Edit",
                                    onClick: (row: Branch) => {
                                        setSelectedBranch(row);
                                        setIsBranchModalOpen(true);
                                    },
                                },
                            ]
                            : []),
                        ...(canManageAssignments
                            ? [
                                {
                                    label: "Assign User",
                                    onClick: (row: Branch) => {
                                        setAssignBranchId(row.id);
                                        setIsAssignModalOpen(true);
                                    },
                                    className: "text-blue-600",
                                },
                            ]
                            : []),
                        ...(canDelete
                            ? [
                                {
                                    label: "Delete",
                                    onClick: (row: Branch) => setConfirmDelete(row),
                                    className: "text-red-500",
                                },
                            ]
                            : []),
                    ]}
                    isLoading={isLoading}
                    emptyState={
                        <div className="flex flex-col items-center gap-2 py-4">
                            <p className="text-gray-500 font-medium">No branches found.</p>
                            {canCreateBranch && (
                                <button
                                    onClick={() => {
                                        setSelectedBranch(undefined);
                                        setIsBranchModalOpen(true);
                                    }}
                                    className="text-sm text-[#e60023] font-semibold hover:underline"
                                >
                                    Add your first branch
                                </button>
                            )}
                        </div>
                    }
                />

                <PaginationControls
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                />

                <BranchModal
                    isOpen={isBranchModalOpen}
                    onClose={() => {
                        setIsBranchModalOpen(false);
                        setSelectedBranch(undefined);
                    }}
                    onSuccess={refresh}
                    branch={selectedBranch as any}
                />

                <AssignUserModal
                    isOpen={isAssignModalOpen}
                    onClose={() => {
                        setIsAssignModalOpen(false);
                        setAssignBranchId("");
                    }}
                    onSuccess={refresh}
                    branchId={assignBranchId}
                />

                <ConfirmDialog
                    open={Boolean(confirmDelete)}
                    title="Delete Branch"
                    message={
                        confirmDelete
                            ? `Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`
                            : ""
                    }
                    confirmLabel="Delete"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDelete(undefined)}
                    isLoading={isDeleting}
                />
            </div>
        </PermissionGuard>
    );
}

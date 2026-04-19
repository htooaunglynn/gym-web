"use client";

import { useState } from "react";
import { DataTable } from "@/components/crud/DataTable";
import { AddTrainerModal } from "@/components/crud/AddTrainerModal";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { useTrainers } from "@/hooks/useTrainers";
import { TrainersHeader } from "@/components/dashboard/trainers/TrainersHeader";
import { Trainer } from "@/types/trainer";
import Image from "next/image";

export default function TrainersPage() {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const { trainers, meta, isLoading, deleteTrainer, refresh } = useTrainers(page);

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | undefined>(undefined);
    const [confirmDelete, setConfirmDelete] = useState<Trainer | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState(false);

    // Permissions
    const canCreateUpdate = usePermission("TRAINERS", "CREATE_UPDATE");
    const canDelete = usePermission("TRAINERS", "DELETE");

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleDeleteConfirm = async () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        const success = await deleteTrainer(confirmDelete.id);
        if (success) setConfirmDelete(undefined);
        setIsDeleting(false);
    };

    // ── Column definitions ─────────────────────────────────────────────────────

    const columns = [
        {
            header: "Id",
            accessor: (row: Trainer) => (
                <span className="text-gray-500 font-mono text-xs">
                    #{row.id.slice(0, 8)}
                </span>
            ),
        },
        {
            header: "Name",
            accessor: (row: Trainer) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100">
                        <Image
                            src={`https://ui-avatars.com/api/?name=${row.firstName}+${row.lastName}&background=random`}
                            alt="Avatar"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <span className="font-bold text-gray-900">
                        {row.firstName} {row.lastName}
                    </span>
                </div>
            ),
        },
        {
            header: "Specialization",
            accessor: (row: Trainer) => (
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                    {row.specialization}
                </span>
            ),
        },
        {
            header: "Status",
            accessor: () => (
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                    Active
                </div>
            ),
        },
        {
            header: "Contact",
            accessor: (row: Trainer) => (
                <div className="flex flex-col text-xs text-gray-500">
                    <span className="font-medium">{row.email}</span>
                    <span>{row.phone}</span>
                </div>
            ),
        },
    ];

    return (
        <PermissionGuard feature="TRAINERS" action="VIEW">
            <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
                <TrainersHeader 
                    onAddClick={() => {
                        setSelectedTrainer(undefined);
                        setIsModalOpen(true);
                    }}
                    canCreate={canCreateUpdate}
                />

                <DataTable
                    columns={columns}
                    data={trainers}
                    actions={[
                        ...(canCreateUpdate
                            ? [
                                {
                                    label: "Edit Profile",
                                    onClick: (row: Trainer) => {
                                        setSelectedTrainer(row);
                                        setIsModalOpen(true);
                                    },
                                },
                            ]
                            : []),
                        ...(canDelete
                            ? [
                                {
                                    label: "Remove",
                                    onClick: (row: Trainer) => setConfirmDelete(row),
                                    className: "text-[#E84C4C] hover:bg-red-50",
                                },
                            ]
                            : []),
                    ]}
                    isLoading={isLoading}
                />

                <PaginationControls
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                />

                <AddTrainerModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedTrainer(undefined);
                    }}
                    onSuccess={refresh}
                    trainer={selectedTrainer as any}
                />

                <ConfirmDialog
                    open={!!confirmDelete}
                    title="Remove Trainer"
                    message={
                        confirmDelete
                            ? `Are you sure you want to remove ${confirmDelete.firstName} ${confirmDelete.lastName}? This action cannot be undone.`
                            : ""
                    }
                    confirmLabel="Remove"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDelete(undefined)}
                    isLoading={isDeleting}
                />
            </div>
        </PermissionGuard>
    );
}

"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/crud/DataTable";
import { AddMemberModal } from "@/components/crud/AddMemberModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { BranchScopeNotice } from "@/components/shared/BranchScopeNotice";
import {
    ALL_BRANCHES_READONLY_MESSAGE,
    isAllBranchesScope,
} from "@/lib/branchScope";
import { Member } from "@/types/member";
import { useMembers } from "@/hooks/useMembers";
import { MembersHeader } from "@/components/dashboard/members/MembersHeader";
import { AssignTrainerModal } from "@/components/dashboard/members/AssignTrainerModal";
import Image from "next/image";

export default function MembersPage() {
    const { user, activeBranchId } = useAuth();
    const canCreateUpdate = usePermission("MEMBERS", "CREATE_UPDATE");
    const canDelete = usePermission("MEMBERS", "DELETE");
    const isAllBranchesMode = isAllBranchesScope(user, activeBranchId);

    const [page, setPage] = useState(1);
    const { members, meta, isLoading, deleteMember, assignTrainer, refresh, handleSort } = useMembers(page);

    useEffect(() => {
        setPage(1);
    }, [activeBranchId]);

    // Tab state (for UI only in this basic version, could be passed to hook if API supports filtering)
    const [activeTab, setActiveTab] = useState("All Members");

    // Modals state
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
    const [confirmDelete, setConfirmDelete] = useState<Member | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
    const [trainerMemberId, setTrainerMemberId] = useState<string | null>(null);
    const [isAssigningTrainer, setIsAssigningTrainer] = useState(false);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleEditClick = (member: Member) => {
        setSelectedMember(member);
        setIsAddEditModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        const success = await deleteMember(confirmDelete.id);
        if (success) setConfirmDelete(undefined);
        setIsDeleting(false);
    };

    const handleAssignTrainerConfirm = async (trainer: any) => {
        if (!trainerMemberId) return;
        setIsAssigningTrainer(true);
        const success = await assignTrainer(trainerMemberId, trainer?.id ?? null);
        if (success) {
            setIsTrainerModalOpen(false);
            setTrainerMemberId(null);
        }
        setIsAssigningTrainer(false);
    };

    // ── Column definitions ─────────────────────────────────────────────────────

    const columns = [
        {
            header: "Id",
            className: "w-[80px]",
            accessor: (row: Member) => (
                <span className="text-gray-500">#{row.id.slice(0, 4)}</span>
            ),
            sortKey: "id",
        },
        {
            header: "Name",
            className: "min-w-[150px]",
            accessor: (row: Member) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative shadow-sm">
                        <Image
                            src={`https://ui-avatars.com/api/?name=${row.firstName}+${row.lastName}&background=random`}
                            alt="Avatar"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <span className="font-bold">
                        {row.firstName} {row.lastName}
                    </span>
                </div>
            ),
            sortKey: "firstName",
        },
        {
            header: "Trainer Status",
            className: "w-[120px]",
            accessor: (row: Member) => (
                <span className="text-gray-600 font-semibold">
                    {row.trainerId ? "Has Trainer" : "Independent"}
                </span>
            ),
            sortKey: "trainerId",
        },
        {
            header: "Phone",
            className: "w-[160px]",
            accessor: (row: Member) => (
                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                    <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {row.phone}
                </div>
            ),
            sortKey: "phone",
        },
        {
            header: "City",
            className: "w-[120px]",
            accessor: (row: Member) => (
                <span className="text-gray-600 font-medium">{row.city ?? "—"}</span>
            ),
            sortKey: "city",
        },
        {
            header: "Township",
            className: "w-[140px]",
            accessor: (row: Member) => (
                <span className="text-gray-600 font-medium">{row.township ?? "—"}</span>
            ),
            sortKey: "township",
        },
        {
            header: "Email",
            accessor: (row: Member) => (
                <span className="text-[#E84C4C] min-w-[200px]">{row.email}</span>
            ),
            className: "min-w-[200px]",
            sortKey: "email",
        },
        {
            header: "Status",
            className: "w-[140px]",
            accessor: () => (
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <span className="w-2 h-2 rounded-full bg-[#FF9500] shadow-[0_0_8px_#FF9500] animate-pulse" />
                    Active
                </div>
            ),
        },
    ];

    return (
        <PermissionGuard feature="MEMBERS" action="VIEW">
            <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
                <MembersHeader
                    onAddClick={() => {
                        setSelectedMember(undefined);
                        setIsAddEditModalOpen(true);
                    }}
                    isAllBranchesMode={isAllBranchesMode}
                />

                <BranchScopeNotice
                    isVisible={isAllBranchesMode}
                    message={ALL_BRANCHES_READONLY_MESSAGE}
                />

                <DataTable
                    columns={columns}
                    data={members}
                    isLoading={isLoading}
                    sortable={true}
                    onSort={handleSort}
                    tabs={["All Members", "With Trainers", "Independent"]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    actions={[
                        ...(canCreateUpdate && !isAllBranchesMode
                            ? [
                                {
                                    label: "Edit Details",
                                    onClick: handleEditClick,
                                },
                                {
                                    label: "Assign Trainer",
                                    onClick: (member: Member) => {
                                        setTrainerMemberId(member.id);
                                        setIsTrainerModalOpen(true);
                                    },
                                },
                            ]
                            : []),
                        ...(canDelete && !isAllBranchesMode
                            ? [
                                {
                                    label: "Remove",
                                    onClick: (member: Member) => setConfirmDelete(member),
                                    className: "text-[#E84C4C] hover:bg-red-50",
                                },
                            ]
                            : []),
                    ]}
                />

                <PaginationControls
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                />

                {/* Modals */}
                <AddMemberModal
                    isOpen={isAddEditModalOpen}
                    onClose={() => {
                        setIsAddEditModalOpen(false);
                        setSelectedMember(undefined);
                    }}
                    onSuccess={refresh}
                    member={selectedMember}
                />

                <ConfirmDialog
                    open={!!confirmDelete}
                    title="Remove Member"
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

                <AssignTrainerModal
                    isOpen={isTrainerModalOpen}
                    isLoading={isAssigningTrainer}
                    onClose={() => {
                        setIsTrainerModalOpen(false);
                        setTrainerMemberId(null);
                    }}
                    onConfirm={handleAssignTrainerConfirm}
                />
            </div>
        </PermissionGuard>
    );
}

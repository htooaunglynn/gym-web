"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { AddMemberModal, Member } from "@/components/crud/AddMemberModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { TrainerSelect } from "@/components/forms/TrainerSelect";
import { apiClient, PaginationResponse, PaginationMeta } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import { usePermission } from "@/hooks/usePermission";
import { X } from "lucide-react";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function MembersPage() {
  const { showToast } = useToast();
  const canCreateUpdate = usePermission("MEMBERS", "CREATE_UPDATE");
  const canDelete = usePermission("MEMBERS", "DELETE");

  const [members, setMembers] = useState<Member[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Members");

  // Add / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(
    undefined,
  );

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState<Member | undefined>(
    undefined,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Assign Trainer modal state
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [trainerMemberId, setTrainerMemberId] = useState<string | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isAssigningTrainer, setIsAssigningTrainer] = useState(false);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await apiClient<PaginationResponse<Member>>("/members", {
        params: { page, limit: 20, includeDeleted: false },
      });
      setMembers(result.data);
      setMeta(result.meta);
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers, activeTab]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMember(undefined);
  };

  const handleModalSuccess = () => {
    fetchMembers();
  };

  const handleDeleteClick = (member: Member) => {
    setConfirmDelete(member);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await apiClient(`/members/${confirmDelete.id}`, { method: "DELETE" });
      showToast("Member removed successfully", "success");
      setConfirmDelete(undefined);
      fetchMembers();
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignTrainerClick = (member: Member) => {
    setTrainerMemberId(member.id);
    // Pre-select the current trainer if any
    setSelectedTrainer(null);
    setIsTrainerModalOpen(true);
  };

  const handleAssignTrainerConfirm = async () => {
    if (!trainerMemberId) return;
    setIsAssigningTrainer(true);
    try {
      await apiClient(`/members/${trainerMemberId}`, {
        method: "PATCH",
        body: JSON.stringify({ trainerId: selectedTrainer?.id ?? null }),
      });
      showToast("Trainer assigned successfully", "success");
      setIsTrainerModalOpen(false);
      setTrainerMemberId(null);
      setSelectedTrainer(null);
      fetchMembers();
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsAssigningTrainer(false);
    }
  };

  // ── Column definitions ─────────────────────────────────────────────────────

  const columns: ColumnDef<Member>[] = [
    {
      header: "Id",
      className: "w-[80px]",
      accessor: (row) => (
        <span className="text-gray-500">#{row.id.slice(0, 4)}</span>
      ),
    },
    {
      header: "Name",
      className: "min-w-[150px]",
      accessor: (row) => (
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
    },
    {
      header: "Trainer Status",
      className: "w-[120px]",
      accessor: (row) => (
        <span className="text-gray-600 font-semibold">
          {row.trainerId ? "Has Trainer" : "Independent"}
        </span>
      ),
    },
    {
      header: "Phone",
      className: "w-[160px]",
      accessor: (row) => (
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
    },
    {
      header: "Email",
      accessor: "email",
      className: "text-[#E84C4C] min-w-[200px]",
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
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">
            Members
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Manage your gym members, assign trainers, and track their
            information.
          </p>
        </div>
        <PermissionGuard
          feature="MEMBERS"
          action="CREATE_UPDATE"
          fallback={null}
        >
          <button
            onClick={() => {
              setSelectedMember(undefined);
              setIsModalOpen(true);
            }}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
          >
            + Add Member
          </button>
        </PermissionGuard>
      </div>

      <DataTable
        columns={columns}
        data={members}
        isLoading={isLoading}
        tabs={["All Members", "With Trainers", "Independent"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={[
          ...(canCreateUpdate
            ? [
                {
                  label: "Edit Details",
                  onClick: handleEditClick,
                },
                {
                  label: "Assign Trainer",
                  onClick: handleAssignTrainerClick,
                },
              ]
            : []),
          ...(canDelete
            ? [
                {
                  label: "Remove",
                  onClick: handleDeleteClick,
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

      {/* Add / Edit Member Modal */}
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        member={selectedMember}
      />

      {/* Delete Confirmation Dialog */}
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

      {/* Assign Trainer Modal */}
      {isTrainerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden shadow-black/10">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Assign Trainer
              </h2>
              <button
                onClick={() => {
                  setIsTrainerModalOpen(false);
                  setTrainerMemberId(null);
                  setSelectedTrainer(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <TrainerSelect
                onSelect={setSelectedTrainer}
                selectedTrainerId={selectedTrainer?.id}
                label="Select Trainer"
              />

              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsTrainerModalOpen(false);
                    setTrainerMemberId(null);
                    setSelectedTrainer(null);
                  }}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignTrainerConfirm}
                  disabled={isAssigningTrainer}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {isAssigningTrainer ? "Assigning..." : "Assign Trainer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

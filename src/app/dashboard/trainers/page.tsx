"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { AddTrainerModal } from "@/components/crud/AddTrainerModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { usePermission } from "@/hooks/usePermission";
import { useToast } from "@/contexts/ToastContext";
import { apiClient, PaginationResponse } from "@/lib/apiClient";

interface Trainer {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [meta, setMeta] = useState({
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Trainers");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | undefined>(
    undefined,
  );

  // Delete confirmation state
  const [confirmDeleteTrainer, setConfirmDeleteTrainer] = useState<
    Trainer | undefined
  >(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = usePermission("TRAINERS", "CREATE_UPDATE");
  const canDelete = usePermission("TRAINERS", "DELETE");
  const { showToast } = useToast();

  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      const result = await apiClient<PaginationResponse<Trainer>>("/trainers", {
        params: {
          page,
          limit: 20,
          includeDeleted: false,
          includeMembers: false,
        },
      });
      setTrainers(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  const handleOpenCreate = () => {
    setSelectedTrainer(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrainer(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteTrainer) return;
    setIsDeleting(true);
    try {
      await apiClient(`/trainers/${confirmDeleteTrainer.id}`, {
        method: "DELETE",
      });
      showToast(
        `${confirmDeleteTrainer.firstName} ${confirmDeleteTrainer.lastName} has been deactivated`,
        "success",
      );
      setConfirmDeleteTrainer(undefined);
      fetchTrainers();
    } catch {
      // apiClient already shows an error toast
      setConfirmDeleteTrainer(undefined);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Trainer>[] = [
    {
      header: "Id",
      className: "w-[80px]",
      accessor: (row) => (
        <span className="text-gray-500">#{row.id.slice(0, 4)}</span>
      ),
    },
    {
      header: "Trainer Name",
      className: "min-w-[200px]",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative shadow-sm ring-2 ring-gray-100">
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
  ];

  // Build actions array based on permissions
  const actions = [
    canEdit
      ? {
          label: "View Profile",
          onClick: (row: Trainer) => handleOpenEdit(row),
        }
      : null,
    canDelete
      ? {
          label: "Deactivate",
          onClick: (row: Trainer) => setConfirmDeleteTrainer(row),
          className: "text-[#E84C4C] hover:bg-red-50",
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    onClick: (row: Trainer) => void;
    className?: string;
  }[];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">
            Trainers
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Manage fitness instructors and viewing their assigned members.
          </p>
        </div>
        <PermissionGuard
          feature="TRAINERS"
          action="CREATE_UPDATE"
          fallback={null}
        >
          <button
            onClick={handleOpenCreate}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
          >
            + Add Trainer
          </button>
        </PermissionGuard>
      </div>

      <DataTable
        columns={columns}
        data={trainers}
        isLoading={isLoading}
        tabs={["All Trainers", "Active", "On Leave"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={actions}
      />

      <PaginationControls
        currentPage={page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />

      <AddTrainerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchTrainers}
        trainer={selectedTrainer}
      />

      <ConfirmDialog
        open={!!confirmDeleteTrainer}
        title="Deactivate Trainer"
        message={
          confirmDeleteTrainer
            ? `Are you sure you want to deactivate ${confirmDeleteTrainer.firstName} ${confirmDeleteTrainer.lastName}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Deactivate"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteTrainer(undefined)}
        isLoading={isDeleting}
      />
    </div>
  );
}

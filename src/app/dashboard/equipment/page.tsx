"use client";

import { useEffect, useState } from "react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { AddEquipmentModal } from "@/components/crud/AddEquipmentModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePermission } from "@/hooks/usePermission";
import { useToast } from "@/contexts/ToastContext";
import { apiClient, PaginationResponse } from "@/lib/apiClient";

interface Equipment {
  id: string;
  name: string;
  description: string;
  quantity: number;
  condition: "NEW" | "GOOD" | "FAIR" | "POOR";
  createdAt: string;
}

export default function EquipmentPage() {
  const [rows, setRows] = useState<Equipment[]>([]);
  const [meta, setMeta] = useState({
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Equipment");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Equipment | undefined>(
    undefined,
  );

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState<Equipment | undefined>(
    undefined,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = usePermission("EQUIPMENT", "CREATE_UPDATE");
  const canDelete = usePermission("EQUIPMENT", "DELETE");
  const { showToast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await apiClient<PaginationResponse<Equipment>>(
        "/equipment",
        {
          params: { page, limit: 20, includeDeleted: false },
        },
      );
      setRows(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  const handleOpenCreate = () => {
    setSelectedRow(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (equipment: Equipment) => {
    setSelectedRow(equipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await apiClient(`/equipment/${confirmDelete.id}`, { method: "DELETE" });
      showToast(`${confirmDelete.name} has been removed`, "success");
      setConfirmDelete(undefined);
      fetchData();
    } catch {
      // apiClient already shows an error toast
      setConfirmDelete(undefined);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Equipment>[] = [
    {
      header: "Id",
      className: "w-[80px]",
      accessor: (row) => (
        <span className="text-gray-500">#{row.id.slice(0, 4)}</span>
      ),
    },
    {
      header: "Name",
      className: "min-w-[200px]",
      accessor: (row) => (
        <span className="font-bold text-gray-900">{row.name}</span>
      ),
    },
    {
      header: "Description",
      className: "min-w-[250px]",
      accessor: (row) => (
        <span className="text-gray-500 truncate">{row.description}</span>
      ),
    },
    {
      header: "Quantity",
      className: "w-[100px] text-center",
      accessor: (row) => (
        <span className="font-mono bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-bold">
          {row.quantity}
        </span>
      ),
    },
    {
      header: "Condition",
      className: "w-[120px]",
      accessor: (row) => (
        <StatusBadge status={row.condition} variant="equipment" />
      ),
    },
    {
      header: "Created",
      className: "w-[140px]",
      accessor: (row) => (
        <span className="text-gray-500 text-sm">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // Build actions array based on permissions
  const actions = [
    canEdit
      ? {
          label: "Edit Details",
          onClick: (row: Equipment) => handleOpenEdit(row),
        }
      : null,
    canDelete
      ? {
          label: "Remove",
          onClick: (row: Equipment) => setConfirmDelete(row),
          className: "text-[#E84C4C] hover:bg-red-50",
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    onClick: (row: Equipment) => void;
    className?: string;
  }[];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">
            Equipment & Assets
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Manage machines, free weights, and gym inventory states.
          </p>
        </div>
        <PermissionGuard
          feature="EQUIPMENT"
          action="CREATE_UPDATE"
          fallback={null}
        >
          <button
            onClick={handleOpenCreate}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
          >
            + Add Equipment
          </button>
        </PermissionGuard>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        tabs={["All Equipment", "Maintenance Needed", "Broken"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={actions}
      />

      <PaginationControls
        currentPage={page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />

      <AddEquipmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchData}
        equipment={selectedRow}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Remove Equipment"
        message={
          confirmDelete
            ? `Are you sure you want to remove "${confirmDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Remove"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(undefined)}
        isLoading={isDeleting}
      />
    </div>
  );
}

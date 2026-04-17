"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { BranchModal, Branch } from "@/components/crud/BranchModal";
import { AssignUserModal } from "@/components/crud/AssignUserModal";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { apiClient, PaginationResponse } from "@/lib/apiClient";
import { usePermission } from "@/hooks/usePermission";

// ─── Page Component ───────────────────────────────────────────────────────────

export default function BranchesPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [rows, setRows] = useState<Branch[]>([]);
  const [meta, setMeta] = useState({
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Branch modal (create / edit)
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(
    undefined,
  );

  // Assign user modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignBranchId, setAssignBranchId] = useState<string>("");

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState<Branch | undefined>(
    undefined,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Permissions ────────────────────────────────────────────────────────────
  const canCreateUpdate = usePermission("BRANCHES", "CREATE_UPDATE");
  const canDelete = usePermission("BRANCHES", "DELETE");
  const canManageAssignments = usePermission(
    "BRANCH_USER_ASSIGNMENTS",
    "MANAGE",
  );

  // ── Data Fetch ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient<PaginationResponse<Branch>>("/branches", {
        params: {
          page,
          limit: 20,
          includeDeleted: false,
          includeUsers: true,
        },
      });
      setRows(res.data);
      setMeta(res.meta);
    } catch {
      // apiClient handles toast
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await apiClient(`/branches/${confirmDelete.id}`, { method: "DELETE" });
      setConfirmDelete(undefined);
      fetchData();
    } catch {
      // apiClient handles toast
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<Branch>[] = [
    {
      header: "ID",
      accessor: (row) => (
        <span className="font-mono text-xs text-gray-500">
          {row.id.slice(0, 8)}…
        </span>
      ),
    },
    {
      header: "Name",
      accessor: (row) => (
        <span className="font-semibold text-gray-900">{row.name}</span>
      ),
    },
    {
      header: "Description",
      accessor: (row) => (
        <span className="text-gray-500 text-sm truncate max-w-[200px] block">
          {row.description ?? "—"}
        </span>
      ),
    },
    {
      header: "Assigned Users",
      accessor: (row) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-700">
          {row.users?.length ?? 0}
        </span>
      ),
    },
    {
      header: "Created",
      accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  // ── Actions ────────────────────────────────────────────────────────────────
  const actions = [
    ...(canCreateUpdate
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
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PermissionGuard feature="BRANCHES" action="VIEW">
      <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-tight">
              Branches
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Manage gym branch locations and their staff assignments.
            </p>
          </div>

          {/* Add Branch — guarded by CREATE_UPDATE */}
          {canCreateUpdate && (
            <button
              onClick={() => {
                setSelectedBranch(undefined);
                setIsBranchModalOpen(true);
              }}
              className="bg-[#e60023] hover:bg-[#c4001f] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#e60023]/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Branch
            </button>
          )}
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={rows}
          actions={actions}
          isLoading={isLoading}
          emptyState={
            <div className="flex flex-col items-center gap-2 py-4">
              <p className="text-gray-500 font-medium">No branches found.</p>
              {canCreateUpdate && (
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

        {/* Pagination */}
        <PaginationControls
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />

        {/* Branch Modal (create / edit) */}
        <BranchModal
          isOpen={isBranchModalOpen}
          onClose={() => {
            setIsBranchModalOpen(false);
            setSelectedBranch(undefined);
          }}
          onSuccess={fetchData}
          branch={selectedBranch}
        />

        {/* Assign User Modal */}
        <AssignUserModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setAssignBranchId("");
          }}
          onSuccess={fetchData}
          branchId={assignBranchId}
        />

        {/* Delete Confirmation Dialog */}
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

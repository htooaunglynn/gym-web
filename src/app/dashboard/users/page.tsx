"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { AddUserModal } from "@/components/crud/AddUserModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { usePermission } from "@/hooks/usePermission";
import { useToast } from "@/contexts/ToastContext";
import { apiClient, PaginationResponse } from "@/lib/apiClient";

interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "BRANCH_ADMIN" | "STAFF" | "HR" | "MANAGER";
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState({
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Users");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // Delete confirmation state
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<User | undefined>(
    undefined,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = usePermission("USERS", "CREATE_UPDATE");
  const canDelete = usePermission("USERS", "DELETE");
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await apiClient<PaginationResponse<User>>("/users", {
        params: { page, limit: 20, includeDeleted: false },
      });
      setUsers(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  const handleOpenCreate = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteUser) return;
    setIsDeleting(true);
    try {
      await apiClient(`/users/${confirmDeleteUser.id}`, { method: "DELETE" });
      showToast(
        `${confirmDeleteUser.firstName} ${confirmDeleteUser.lastName}'s access has been revoked`,
        "success",
      );
      setConfirmDeleteUser(undefined);
      fetchUsers();
    } catch {
      // apiClient already shows an error toast
      setConfirmDeleteUser(undefined);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      header: "Id",
      className: "w-[80px]",
      accessor: (row) => (
        <span className="text-gray-500">#{row.id.slice(0, 4)}</span>
      ),
    },
    {
      header: "User Name",
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
      header: "Role",
      className: "w-[120px]",
      accessor: (row) => (
        <span
          className={`px-3 py-1 rounded-[8px] text-[11px] font-bold uppercase tracking-wider ${row.role === "ADMIN" ? "bg-[#FF5C39]/10 text-[#E84C4C] border border-[#FF5C39]/20" : "bg-blue-50 text-blue-600 border border-blue-100"}`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: "Phone",
      className: "w-[160px]",
      accessor: (row) => (
        <div className="flex items-center gap-1.5 text-gray-500 font-medium">
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
          label: "Change Role",
          onClick: (row: User) => handleOpenEdit(row),
        }
      : null,
    canDelete
      ? {
          label: "Revoke Access",
          onClick: (row: User) => setConfirmDeleteUser(row),
          className: "text-[#E84C4C] hover:bg-red-50",
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    onClick: (row: User) => void;
    className?: string;
  }[];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">
            System Users
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Manage staff and administrative access to the platform.
          </p>
        </div>
        <PermissionGuard feature="USERS" action="CREATE_UPDATE" fallback={null}>
          <button
            onClick={handleOpenCreate}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
          >
            + Add User
          </button>
        </PermissionGuard>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        tabs={["All Users", "Admins Only", "Staff Only"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={actions}
      />

      <PaginationControls
        currentPage={page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />

      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchUsers}
        user={selectedUser}
      />

      <ConfirmDialog
        open={!!confirmDeleteUser}
        title="Revoke Access"
        message={
          confirmDeleteUser
            ? `Are you sure you want to revoke access for ${confirmDeleteUser.firstName} ${confirmDeleteUser.lastName}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Revoke Access"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteUser(undefined)}
        isLoading={isDeleting}
      />
    </div>
  );
}

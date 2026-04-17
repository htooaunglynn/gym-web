"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import {
  SubscriptionModal,
  MemberSubscription,
} from "@/components/crud/SubscriptionModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { apiClient, PaginationResponse } from "@/lib/apiClient";
import { usePermission } from "@/hooks/usePermission";

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = ["All", "Active", "Paused", "Cancelled", "Expired"] as const;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [rows, setRows] = useState<MemberSubscription[]>([]);
  const [meta, setMeta] = useState({
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<
    MemberSubscription | undefined
  >(undefined);
  const [confirmDelete, setConfirmDelete] = useState<
    MemberSubscription | undefined
  >(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);

  // ── Permissions ────────────────────────────────────────────────────────────
  const canCreateUpdate = usePermission(
    "MEMBER_SUBSCRIPTIONS",
    "CREATE_UPDATE",
  );
  const canDelete = usePermission("MEMBER_SUBSCRIPTIONS", "DELETE");
  const canApprove = usePermission("SUBSCRIPTION_APPROVALS", "APPROVE");

  // ── Data Fetch ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        page,
        limit: 20,
      };
      if (activeTab !== "All") params.status = activeTab;

      const res = await apiClient<PaginationResponse<MemberSubscription>>(
        "/member-subscriptions",
        { params },
      );
      setRows(res.data);
      setMeta(res.meta);
    } catch {
      // apiClient handles toast
    } finally {
      setIsLoading(false);
    }
  }, [page, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await apiClient(`/member-subscriptions/${confirmDelete.id}`, {
        method: "DELETE",
      });
      setConfirmDelete(undefined);
      fetchData();
    } catch {
      // apiClient handles toast
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Approve ────────────────────────────────────────────────────────────────
  const handleApprove = async (row: MemberSubscription) => {
    setIsApproving(row.id);
    try {
      await apiClient(`/member-subscriptions/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      fetchData();
    } catch {
      // apiClient handles toast
    } finally {
      setIsApproving(null);
    }
  };

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<MemberSubscription>[] = [
    {
      header: "ID",
      accessor: (row) => (
        <span className="font-mono text-xs text-gray-500">
          {row.id.slice(0, 8)}…
        </span>
      ),
    },
    {
      header: "Member",
      accessor: (row) =>
        row.member
          ? `${row.member.firstName} ${row.member.lastName}`
          : row.memberId,
    },
    {
      header: "Plan",
      accessor: (row) => row.membershipPlan?.name ?? row.membershipPlanId,
    },
    {
      header: "Status",
      accessor: (row) => (
        <StatusBadge status={row.status} variant="subscription" />
      ),
    },
    {
      header: "Start Date",
      accessor: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      header: "End Date",
      accessor: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      header: "Payment",
      accessor: (row) => (
        <StatusBadge status={row.paymentStatus} variant="payment" />
      ),
    },
  ];

  // ── Actions ────────────────────────────────────────────────────────────────
  const actions = [
    {
      label: "Edit",
      onClick: (row: MemberSubscription) => {
        setSelectedRow(row);
        setIsModalOpen(true);
      },
    },
    ...(canDelete
      ? [
          {
            label: "Delete",
            onClick: (row: MemberSubscription) => setConfirmDelete(row),
            className: "text-red-500",
          },
        ]
      : []),
    ...(canApprove
      ? [
          {
            label: "Approve",
            onClick: (row: MemberSubscription) => {
              if (row.status !== "ACTIVE" && isApproving !== row.id) {
                handleApprove(row);
              }
            },
            className: "text-green-600",
          },
        ]
      : []),
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PermissionGuard feature="MEMBER_SUBSCRIPTIONS" action="VIEW">
      <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-tight">
              Subscriptions
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Manage member subscriptions, statuses, and payment records.
            </p>
          </div>

          {/* Add Subscription — guarded by CREATE_UPDATE */}
          {canCreateUpdate && (
            <button
              onClick={() => {
                setSelectedRow(undefined);
                setIsModalOpen(true);
              }}
              className="bg-[#E84C4C] hover:bg-[#d43f3f] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#E84C4C]/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Subscription
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-[#211922] text-white shadow-sm"
                  : "bg-[#f0efed] text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={rows}
          actions={actions}
          isLoading={isLoading}
        />

        {/* Pagination */}
        <PaginationControls
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />

        {/* Subscription Modal (create / edit) */}
        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRow(undefined);
          }}
          onSuccess={fetchData}
          subscription={selectedRow}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={Boolean(confirmDelete)}
          title="Delete Subscription"
          message={
            confirmDelete
              ? `Are you sure you want to delete the subscription for ${
                  confirmDelete.member
                    ? `${confirmDelete.member.firstName} ${confirmDelete.member.lastName}`
                    : confirmDelete.memberId
                }? This action cannot be undone.`
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

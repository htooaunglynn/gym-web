"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { AddInventoryModal } from "@/components/crud/AddInventoryModal";
import {
    apiClient,
    normalizeListResponse,
    PaginationResponse,
} from "@/lib/apiClient";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";

interface InventoryMovement {
    id: string;
    equipmentId: string;
    movementType: "INCOMING" | "OUTGOING" | "ADJUSTMENT";
    quantity: number;
    occurredAt: string;
    reason: string;
    note: string;
    createdAt: string;
}

export default function InventoryPage() {
    const tabs = ["All Actions", "Incoming", "Outgoing", "Adjustment"] as const;

    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [meta, setMeta] = useState({
        totalItems: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All Actions");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMovements = useCallback(async () => {
        setIsLoading(true);
        try {
            const movementType =
                activeTab === "Incoming"
                    ? "INCOMING"
                    : activeTab === "Outgoing"
                        ? "OUTGOING"
                        : activeTab === "Adjustment"
                            ? "ADJUSTMENT"
                            : undefined;

            const result = await apiClient<PaginationResponse<InventoryMovement>>(
                "/inventory-movements",
                {
                    params: { page, limit: 20, movementType },
                },
            );
            const normalized = normalizeListResponse(result);
            setMovements(normalized.data);
            setMeta(normalized.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, activeTab]);

    useEffect(() => {
        fetchMovements();
    }, [fetchMovements]);

    const getTypeStyle = (type: string) => {
        switch (type) {
            case "INCOMING":
                return "text-emerald-600 bg-emerald-50 border border-emerald-100";
            case "OUTGOING":
                return "text-indigo-600 bg-indigo-50 border border-indigo-100";
            case "ADJUSTMENT":
                return "text-amber-600 bg-amber-50 border border-amber-100";
            default:
                return "text-gray-600 bg-gray-50 border border-gray-200";
        }
    };

    const columns: ColumnDef<InventoryMovement>[] = [
        {
            header: "Date Time",
            className: "min-w-[160px]",
            accessor: (row) => (
                <span className="text-gray-500 font-medium">
                    {new Date(row.occurredAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                    })}
                </span>
            ),
        },
        {
            header: "Type",
            className: "w-[130px]",
            accessor: (row) => (
                <span
                    className={`px-3 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${getTypeStyle(row.movementType)}`}
                >
                    {row.movementType}
                </span>
            ),
        },
        {
            header: "Equipment ID",
            className: "w-[120px]",
            accessor: (row) => (
                <span className="font-mono text-gray-500">
                    {row.equipmentId.slice(0, 8)}
                </span>
            ),
        },
        {
            header: "Qty",
            className: "w-[80px]",
            accessor: (row) => (
                <span
                    className={`font-mono font-bold ${row.movementType === "OUTGOING" ? "text-red-500" : "text-emerald-500"}`}
                >
                    {row.movementType === "OUTGOING"
                        ? "-"
                        : row.movementType === "INCOMING"
                            ? "+"
                            : "="}
                    {row.quantity}
                </span>
            ),
        },
        {
            header: "Reason",
            className: "min-w-[200px]",
            accessor: (row) => (
                <span className="text-gray-900 font-semibold">{row.reason}</span>
            ),
        },
    ];

    return (
        <PermissionGuard feature="INVENTORY_MOVEMENTS" action="VIEW">
            <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">
                            Inventory Logs
                        </h1>
                        <p className="text-gray-500 font-medium text-sm">
                            Track equipment additions, deployments, and audit cycle counts.
                        </p>
                    </div>
                    <PermissionGuard
                        feature="INVENTORY_MOVEMENTS"
                        action="CREATE_UPDATE"
                        fallback={null}
                    >
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
                        >
                            Add Movement
                        </button>
                    </PermissionGuard>
                </div>

                <DataTable
                    columns={columns}
                    data={movements}
                    isLoading={isLoading}
                    tabs={[...tabs]}
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                        setActiveTab(tab as (typeof tabs)[number]);
                        setPage(1);
                    }}
                    actions={[
                        {
                            label: "View Details",
                            onClick: (row) => console.log("Edit", row.id),
                        },
                    ]}
                />

                <PaginationControls
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={(p) => {
                        setPage(p);
                    }}
                />

                <AddInventoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchMovements}
                />
            </div>
        </PermissionGuard>
    );
}

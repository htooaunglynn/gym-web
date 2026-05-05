"use client";

import { useCallback, useEffect, useState } from "react";
import {
    apiClient,
    normalizeListResponse,
    PaginationResponse,
} from "@/lib/apiClient";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { SaleModal } from "@/components/dashboard/SaleModal";
import { BranchScopeNotice } from "@/components/shared/BranchScopeNotice";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
    ALL_BRANCHES_READONLY_MESSAGE,
    isAllBranchesScope,
} from "@/lib/branchScope";
import { Plus, ShoppingBag, User, Calendar } from "lucide-react";

interface SaleItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    product?: { name: string };
}

interface Sale {
    id: string;
    memberId: string | null;
    totalAmount: number;
    paymentStatus: string;
    paymentMethod: string;
    occurredAt: string;
    member?: {
        firstName: string;
        lastName: string;
    };
    items: SaleItem[];
}

const DEFAULT_META = {
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
};

export default function SalesPage() {
    const { user, activeBranchId } = useAuth();
    const [sales, setSales] = useState<Sale[]>([]);
    const [meta, setMeta] = useState(DEFAULT_META);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<Sale | undefined>(undefined);
    const isAllBranchesMode = isAllBranchesScope(user, activeBranchId);

    const fetchSales = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await apiClient<PaginationResponse<Sale>>(
                "/product-sales",
                {
                    params: { page, limit: 20 },
                },
            );
            const normalized = normalizeListResponse(result);
            setSales(normalized.data);
            setMeta(normalized.meta);
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setIsLoading(false);
        }
    }, [activeBranchId, page]);

    useEffect(() => {
        setPage(1);
        setSales([]);
        setMeta(DEFAULT_META);
    }, [activeBranchId]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const columns: ColumnDef<Sale>[] = [
        {
            header: "Transaction",
            className: "min-w-[180px]",
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-bold">
                            #{row.id.slice(0, 8).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {new Date(row.occurredAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Customer",
            className: "min-w-[200px]",
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                        {row.member
                            ? `${row.member.firstName} ${row.member.lastName}`
                            : "Guest Customer"}
                    </span>
                </div>
            ),
        },
        {
            header: "Amount",
            className: "w-[120px]",
            accessor: (row) => (
                <span className="text-gray-900 font-bold font-mono">
                    ${parseFloat(row.totalAmount.toString()).toFixed(2)}
                </span>
            ),
        },
        {
            header: "Payment",
            className: "w-[150px]",
            accessor: (row) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${row.paymentStatus === "PAID" ? "bg-[#33D073]" : "bg-amber-400"}`}
                        />
                        <span
                            className={`text-[10px] font-black uppercase tracking-widest ${row.paymentStatus === "PAID" ? "text-[#33D073]" : "text-amber-500"}`}
                        >
                            {row.paymentStatus}
                        </span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                        via {row.paymentMethod?.replace("_", " ") || "CASH"}
                    </span>
                </div>
            ),
        },
    ];

    return (
        <PermissionGuard feature="PRODUCT_SALES" action="VIEW">
            <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-tight text-gray-900">
                            Sales History
                        </h1>
                        <p className="text-gray-500 font-medium text-sm">
                            Review transactions and track your gym&apos;s retail performance.
                        </p>
                    </div>
                    <PermissionGuard
                        feature="PRODUCT_SALES"
                        action="CREATE_UPDATE"
                        fallback={null}
                    >
                        {!isAllBranchesMode ? (
                            <button
                                onClick={() => {
                                    setSelectedSale(undefined);
                                    setIsModalOpen(true);
                                }}
                                className="bg-[#FF5C39] hover:bg-[#e64a2e] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#FF5C39]/20 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                New Sale
                            </button>
                        ) : null}
                    </PermissionGuard>
                </div>

                <BranchScopeNotice
                    isVisible={isAllBranchesMode}
                    message={ALL_BRANCHES_READONLY_MESSAGE}
                />

                <DataTable
                    columns={columns}
                    data={sales}
                    isLoading={isLoading}
                    actions={[]}
                />

                <PaginationControls
                    currentPage={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                />

                <SaleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchSales}
                    sale={selectedSale}
                />
            </div>
        </PermissionGuard>
    );
}

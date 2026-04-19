"use client";

import { useState } from "react";
import { DataTable } from "@/components/crud/DataTable";
import { ProductModal } from "@/components/dashboard/ProductModal";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/hooks/usePermission";
import { useProducts } from "@/hooks/useProducts";
import { ProductsHeader } from "@/components/dashboard/products/ProductsHeader";
import { Product } from "@/types/product";

export default function ProductsPage() {
    const { user, activeBranchId } = useAuth();
    const [page, setPage] = useState(1);
    const { products, meta, isLoading, deleteProduct, refresh } = useProducts(page);

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [confirmDelete, setConfirmDelete] = useState<Product | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState(false);

    // Permissions
    const canCreateUpdate = usePermission("PRODUCTS", "CREATE_UPDATE");
    const canDelete = usePermission("PRODUCTS", "DELETE");

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleDeleteConfirm = async () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        const success = await deleteProduct(confirmDelete.id);
        if (success) setConfirmDelete(undefined);
        setIsDeleting(false);
    };

    // ── Column definitions ─────────────────────────────────────────────────────

    const columns = [
        {
            header: "Product",
            accessor: (row: Product) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{row.name}</span>
                    <span className="text-xs text-gray-500 line-clamp-1 max-w-[250px]">
                        {row.description}
                    </span>
                </div>
            ),
        },
        {
            header: "Price",
            accessor: (row: Product) => (
                <span className="font-semibold text-[#e60023]">
                    ${row.price.toLocaleString()}
                </span>
            ),
        },
        {
            header: "Stock",
            accessor: (row: Product) => (
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${row.quantity <= 5 ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                    <span className={`font-bold ${row.quantity <= 5 ? "text-red-600" : "text-gray-900"}`}>
                        {row.quantity} units
                    </span>
                </div>
            ),
        },
        {
            header: "ID",
            accessor: (row: Product) => (
                <span className="text-gray-400 font-mono text-[10px]">
                    {row.id}
                </span>
            ),
        },
    ];

    return (
        <PermissionGuard feature="PRODUCTS" action="VIEW">
            <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
                <ProductsHeader 
                    onAddClick={() => {
                        setSelectedProduct(undefined);
                        setIsModalOpen(true);
                    }}
                    canCreate={canCreateUpdate}
                />

                <DataTable
                    columns={columns}
                    data={products}
                    actions={[
                        ...(canCreateUpdate
                            ? [
                                {
                                    label: "Edit Product",
                                    onClick: (row: Product) => {
                                        setSelectedProduct(row);
                                        setIsModalOpen(true);
                                    },
                                },
                            ]
                            : []),
                        ...(canDelete
                            ? [
                                {
                                    label: "Delete",
                                    onClick: (row: Product) => setConfirmDelete(row),
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

                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedProduct(undefined);
                    }}
                    onSuccess={refresh}
                    product={selectedProduct as any}
                />

                <ConfirmDialog
                    open={!!confirmDelete}
                    title="Delete Product"
                    message={
                        confirmDelete
                            ? `Are you sure you want to delete ${confirmDelete.name}? This action cannot be undone.`
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

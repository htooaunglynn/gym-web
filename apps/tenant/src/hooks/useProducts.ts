import { useState, useCallback, useEffect } from "react";
import { ProductService } from "@/services/product.service";
import { Product } from "@/types/product";
import { PaginationMeta } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_META: PaginationMeta = {
    totalItems: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
};

export function useProducts(page = 1, limit = 20) {
    const { activeBranchId } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const { showToast } = useToast();

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await ProductService.getAll({ 
                page, 
                limit,
                sortBy,
                sortOrder
            });
            setProducts(response.data ?? []);
            setMeta(response.meta ?? DEFAULT_META);
        } catch {
            // Error handling managed by apiClient
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, activeBranchId, sortBy, sortOrder]);

    useEffect(() => {
        setProducts([]);
        setMeta(DEFAULT_META);
        setIsLoading(true);
    }, [activeBranchId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const deleteProduct = async (id: string) => {
        try {
            await ProductService.delete(id);
            showToast("Product removed successfully", "success");
            await fetchProducts();
            return true;
        } catch {
            return false;
        }
    };

    const handleSort = (newSortBy: string, newSortOrder: "asc" | "desc") => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    return {
        products,
        meta,
        isLoading,
        refresh: fetchProducts,
        deleteProduct,
        handleSort,
    };
}

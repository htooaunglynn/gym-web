import { useState, useCallback, useEffect } from "react";
import { ProductService } from "@/services/product.service";
import { Product } from "@/types/product";
import { PaginationMeta } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";

export function useProducts(page = 1, limit = 20) {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({
        totalItems: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await ProductService.getAll({ page, limit });
            setProducts(response.data);
            setMeta(response.meta);
        } catch {
            // Error handling managed by apiClient
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

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

    return {
        products,
        meta,
        isLoading,
        refresh: fetchProducts,
        deleteProduct,
    };
}

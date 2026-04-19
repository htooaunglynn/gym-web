import { apiClient, PaginationResponse } from "@/lib/apiClient";
import { Product, CreateProductInput, UpdateProductInput } from "@/types/product";

export const ProductService = {
    async getAll(params: { page?: number; limit?: number; includeDeleted?: boolean } = {}) {
        return apiClient<PaginationResponse<Product>>("/products", { params });
    },

    async getById(id: string) {
        return apiClient<Product>(`/products/${id}`);
    },

    async create(data: CreateProductInput) {
        return apiClient<Product>("/products", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: UpdateProductInput) {
        return apiClient<Product>(`/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string) {
        return apiClient<void>(`/products/${id}`, {
            method: "DELETE",
        });
    },
};

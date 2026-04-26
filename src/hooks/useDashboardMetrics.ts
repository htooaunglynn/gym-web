import { useCallback, useEffect, useState } from "react";
import { apiClient, normalizeListResponse, PaginationResponse } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

export interface InventoryMovement {
    id: string;
    movementType: "INCOMING" | "OUTGOING" | "ADJUSTMENT";
    quantity: number;
    reason: string;
    note?: string;
    occurredAt: string;
    createdAt: string;
}

export interface Product {
    id: string;
    quantity: number;
    [key: string]: unknown;
}

export interface DashboardMetrics {
    totalMembers: number;
    totalTrainers: number;
    totalEquipment: number;
    activeSubscriptionCount: number;
    hasLowStock: boolean;
    recentMovements: InventoryMovement[];
}

const INITIAL_METRICS: DashboardMetrics = {
    totalMembers: 0,
    totalTrainers: 0,
    totalEquipment: 0,
    activeSubscriptionCount: 0,
    hasLowStock: false,
    recentMovements: [],
};

const INITIAL_LOADING_STATES = {
    members: true,
    trainers: true,
    equipment: true,
    activity: true,
    subscriptions: true,
    products: true,
};

export function useDashboardMetrics() {
    const { showToast } = useToast();
    const { activeBranchId } = useAuth();
    const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);

    const [loadingStates, setLoadingStates] = useState(INITIAL_LOADING_STATES);

    const loadDashboardData = useCallback(async () => {
        setMetrics(INITIAL_METRICS);
        setLoadingStates(INITIAL_LOADING_STATES);

        const [
            membersResult,
            trainersResult,
            equipmentResult,
            movementsResult,
            subscriptionsResult,
            productsResult,
        ] = await Promise.allSettled([
            apiClient<PaginationResponse<unknown>>("/members", {
                params: { page: 1, limit: 1 },
            }),
            apiClient<PaginationResponse<unknown>>("/trainers", {
                params: { page: 1, limit: 1, includeDeleted: false },
            }),
            apiClient<PaginationResponse<unknown>>("/equipment", {
                params: { page: 1, limit: 1, includeDeleted: false },
            }),
            apiClient<PaginationResponse<InventoryMovement>>(
                "/inventory-movements",
                { params: { page: 1, limit: 5 } },
            ),
            apiClient<PaginationResponse<unknown>>("/member-subscriptions", {
                params: { status: "ACTIVE", limit: 1 },
            }),
            apiClient<PaginationResponse<Product>>("/products", {
                params: { limit: 50 },
            }),
        ]);

        const newMetrics = { ...INITIAL_METRICS };
        const newLoadingStates = { ...INITIAL_LOADING_STATES };

        // Members
        if (membersResult.status === "fulfilled") {
            newMetrics.totalMembers = normalizeListResponse(membersResult.value).meta.totalItems;
        } else {
            showToast("Failed to load member count.", "error");
        }
        newLoadingStates.members = false;

        // Trainers
        if (trainersResult.status === "fulfilled") {
            newMetrics.totalTrainers = normalizeListResponse(trainersResult.value).meta.totalItems;
        } else {
            showToast("Failed to load trainer count.", "error");
        }
        newLoadingStates.trainers = false;

        // Equipment
        if (equipmentResult.status === "fulfilled") {
            newMetrics.totalEquipment = normalizeListResponse(equipmentResult.value).meta.totalItems;
        } else {
            showToast("Failed to load equipment count.", "error");
        }
        newLoadingStates.equipment = false;

        // Movements
        if (movementsResult.status === "fulfilled") {
            newMetrics.recentMovements = normalizeListResponse(movementsResult.value).data.slice(0, 5);
        } else {
            showToast("Failed to load recent activity.", "error");
        }
        newLoadingStates.activity = false;

        // Subscriptions
        if (subscriptionsResult.status === "fulfilled") {
            newMetrics.activeSubscriptionCount = normalizeListResponse(subscriptionsResult.value).meta.totalItems;
        } else {
            showToast("Failed to load subscription count.", "error");
        }
        newLoadingStates.subscriptions = false;

        // Products
        if (productsResult.status === "fulfilled") {
            const products = normalizeListResponse(productsResult.value).data;
            newMetrics.hasLowStock = products.some((p) => (p as any).quantity <= 5);
        } else {
            showToast("Failed to load product stock data.", "error");
        }
        newLoadingStates.products = false;

        setMetrics(newMetrics);
        setLoadingStates(newLoadingStates);
    }, [showToast, activeBranchId]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    return { metrics, loadingStates, refresh: loadDashboardData };
}

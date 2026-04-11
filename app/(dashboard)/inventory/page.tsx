"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import { InventoryMovementForm } from "@/components/features/inventory/InventoryMovementForm";
import { InventoryMovementTable } from "@/components/features/inventory/InventoryMovementTable";
import { StockLevelTable } from "@/components/features/inventory/StockLevelTable";
import {
    useInventoryMovements,
    useCreateIncoming,
    useCreateOutgoing,
    useCreateAdjustment,
} from "@/hooks/useInventory";
import { useEquipment } from "@/hooks/useEquipment";
import { useToast } from "@/context/ToastContext";
import { PAGINATION } from "@/config/pagination";
import { InventoryMovementFormValues } from "@/lib/validators";
import { MovementType } from "@/types/entities";

export default function InventoryPage() {
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [equipmentId, setEquipmentId] = useState("");
    const [type, setType] = useState<MovementType | "">("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const equipmentQuery = useEquipment({ page: 1, limit: 300 });

    const inventoryParams = useMemo(
        () => ({
            page,
            limit: PAGINATION.inventory.limit,
            equipmentId: equipmentId || undefined,
            type: type || undefined,
            from: from || undefined,
            to: to || undefined,
        }),
        [page, equipmentId, type, from, to]
    );

    const inventoryQuery = useInventoryMovements(inventoryParams);
    const createIncoming = useCreateIncoming();
    const createOutgoing = useCreateOutgoing();
    const createAdjustment = useCreateAdjustment();

    const equipmentOptions = (equipmentQuery.data?.data ?? []).map((item) => ({
        id: item.id,
        label: `${item.name} (${item.quantity})`,
    }));

    const movements = inventoryQuery.data?.data ?? [];
    const meta = inventoryQuery.data?.meta;
    const totalItems = meta?.total ?? 0;
    const pageSize = meta?.limit ?? PAGINATION.inventory.limit;

    const handleIncoming = (values: InventoryMovementFormValues) => {
        createIncoming.mutate(
            {
                equipmentId: values.equipmentId,
                quantity: values.quantity,
                notes: values.notes,
            },
            {
                onSuccess: () => toast.success("Incoming movement recorded"),
                onError: (error) => toast.error("Incoming failed", error.userMessage),
            }
        );
    };

    const handleOutgoing = (values: InventoryMovementFormValues) => {
        createOutgoing.mutate(
            {
                equipmentId: values.equipmentId,
                quantity: values.quantity,
                notes: values.notes,
            },
            {
                onSuccess: () => toast.success("Outgoing movement recorded"),
                onError: (error) => toast.error("Outgoing failed", error.userMessage),
            }
        );
    };

    const handleAdjustment = (values: InventoryMovementFormValues) => {
        createAdjustment.mutate(
            {
                equipmentId: values.equipmentId,
                quantity: values.quantity,
                notes: values.notes,
            },
            {
                onSuccess: () => toast.success("Adjustment recorded"),
                onError: (error) => toast.error("Adjustment failed", error.userMessage),
            }
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="display-lg text-on-surface">Inventory</h1>
                <p className="text-body-md text-on-surface-variant mt-1">
                    Track incoming, outgoing, and adjustment movements with live stock visibility.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Card variant="outlined">
                    <InventoryMovementForm
                        mode="incoming"
                        equipment={equipmentOptions}
                        isSubmitting={createIncoming.isPending}
                        onSubmit={handleIncoming}
                    />
                </Card>

                <Card variant="outlined">
                    <InventoryMovementForm
                        mode="outgoing"
                        equipment={equipmentOptions}
                        isSubmitting={createOutgoing.isPending}
                        onSubmit={handleOutgoing}
                    />
                </Card>

                <Card variant="outlined">
                    <InventoryMovementForm
                        mode="adjustment"
                        equipment={equipmentOptions}
                        isSubmitting={createAdjustment.isPending}
                        onSubmit={handleAdjustment}
                    />
                </Card>
            </div>

            <Card variant="outlined" className="space-y-4">
                <h2 className="title-md text-on-surface">Current Stock Levels</h2>
                {equipmentQuery.isLoading ? (
                    <div className="py-10">
                        <LoadingSpinner text="Loading stock levels..." />
                    </div>
                ) : equipmentQuery.isError ? (
                    <ErrorState
                        title="Could not load equipment stock"
                        message={equipmentQuery.error.userMessage}
                        onRetry={() => equipmentQuery.refetch()}
                    />
                ) : (
                    <StockLevelTable equipment={equipmentQuery.data?.data ?? []} />
                )}
            </Card>

            <Card variant="outlined" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <select
                        value={equipmentId}
                        onChange={(e) => {
                            setEquipmentId(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Equipment</option>
                        {equipmentOptions.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value as MovementType | "");
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Types</option>
                        <option value="INCOMING">Incoming</option>
                        <option value="OUTGOING">Outgoing</option>
                        <option value="ADJUSTMENT">Adjustment</option>
                    </select>

                    <input
                        type="date"
                        value={from}
                        onChange={(e) => {
                            setFrom(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    />

                    <input
                        type="date"
                        value={to}
                        onChange={(e) => {
                            setTo(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    />

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setEquipmentId("");
                            setType("");
                            setFrom("");
                            setTo("");
                            setPage(1);
                        }}
                    >
                        Reset Filters
                    </Button>
                </div>

                {inventoryQuery.isLoading ? (
                    <div className="py-10">
                        <LoadingSpinner text="Loading inventory history..." />
                    </div>
                ) : inventoryQuery.isError ? (
                    <ErrorState
                        title="Could not load movements"
                        message={inventoryQuery.error.userMessage}
                        onRetry={() => inventoryQuery.refetch()}
                    />
                ) : (
                    <>
                        <InventoryMovementTable movements={movements} />

                        <Pagination
                            currentPage={page}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </Card>
        </div>
    );
}

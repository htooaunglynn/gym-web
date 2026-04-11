"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import { EquipmentForm } from "@/components/features/equipment/EquipmentForm";
import { EquipmentTable } from "@/components/features/equipment/EquipmentTable";
import { useEquipment, useCreateEquipment, useUpdateEquipment, useDeleteEquipment } from "@/hooks/useEquipment";
import { useToast } from "@/context/ToastContext";
import { PAGINATION } from "@/config/pagination";
import { CreateEquipmentFormValues, UpdateEquipmentFormValues } from "@/lib/validators";
import { Equipment, EquipmentStatus } from "@/types/entities";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";

const STATUS_OPTIONS: EquipmentStatus[] = ["OPERATIONAL", "UNDER_MAINTENANCE", "DAMAGED", "RETIRED"];

export default function EquipmentPage() {
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<EquipmentStatus | "">("");
    const [category, setCategory] = useState("");
    const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

    const params = useMemo(
        () => ({
            page,
            limit: PAGINATION.equipment.limit,
            search: search || undefined,
            status: status || undefined,
            category: category || undefined,
        }),
        [page, search, status, category]
    );

    const equipmentQuery = useEquipment(params);
    const createEquipment = useCreateEquipment();
    const updateEquipment = useUpdateEquipment();
    const deleteEquipment = useDeleteEquipment();

    const equipment = equipmentQuery.data?.data ?? [];
    const meta = equipmentQuery.data?.meta;
    const totalItems = meta?.total ?? 0;
    const pageSize = meta?.limit ?? PAGINATION.equipment.limit;

    const openCreate = () => {
        setSelectedEquipment(null);
        setPanelMode("create");
    };

    const openEdit = (item: Equipment) => {
        setSelectedEquipment(item);
        setPanelMode("edit");
    };

    const closePanel = () => {
        setSelectedEquipment(null);
        setPanelMode(null);
    };

    const handleCreate = (values: CreateEquipmentFormValues) => {
        createEquipment.mutate(values, {
            onSuccess: () => {
                toast.success("Equipment created");
                closePanel();
            },
            onError: (error) => {
                toast.error("Create failed", error.userMessage);
            },
        });
    };

    const handleUpdate = (values: UpdateEquipmentFormValues) => {
        if (!selectedEquipment) return;

        updateEquipment.mutate(
            {
                id: selectedEquipment.id,
                payload: values,
            },
            {
                onSuccess: () => {
                    toast.success("Equipment updated");
                    closePanel();
                },
                onError: (error) => {
                    toast.error("Update failed", error.userMessage);
                },
            }
        );
    };

    const handleDelete = (item: Equipment) => {
        const ok = window.confirm(`Delete equipment \"${item.name}\"?`);
        if (!ok) return;

        deleteEquipment.mutate(item.id, {
            onSuccess: () => {
                toast.success("Equipment deleted");
            },
            onError: (error) => {
                toast.error("Delete failed", error.userMessage);
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="display-lg text-on-surface">Equipment</h1>
                    <p className="text-body-md text-on-surface-variant mt-1">
                        Track equipment inventory, status, and maintenance notes.
                    </p>
                </div>

                <Button onClick={openCreate}>Add Equipment</Button>
            </div>

            <Card variant="outlined" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by name"
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface placeholder-on-surface/50"
                    />

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value as EquipmentStatus | "");
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map((value) => (
                            <option key={value} value={value}>
                                {value.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>

                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Categories</option>
                        {EQUIPMENT_CATEGORIES.map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearch("");
                            setStatus("");
                            setCategory("");
                            setPage(1);
                        }}
                    >
                        Reset Filters
                    </Button>
                </div>

                {equipmentQuery.isLoading ? (
                    <div className="py-10">
                        <LoadingSpinner text="Loading equipment..." />
                    </div>
                ) : equipmentQuery.isError ? (
                    <ErrorState
                        title="Could not load equipment"
                        message={equipmentQuery.error.userMessage}
                        onRetry={() => equipmentQuery.refetch()}
                    />
                ) : (
                    <>
                        <EquipmentTable
                            equipment={equipment}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            isDeleting={deleteEquipment.isPending}
                        />

                        <Pagination
                            currentPage={page}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </Card>

            {panelMode ? (
                <Card variant="elevated" className="space-y-4">
                    <div>
                        <h2 className="headline-sm text-on-surface">
                            {panelMode === "create" ? "Create equipment" : "Edit equipment"}
                        </h2>
                        <p className="text-body-md text-on-surface-variant mt-1">
                            {panelMode === "create"
                                ? "Add a new equipment item to inventory."
                                : "Update equipment details and status."}
                        </p>
                    </div>

                    <EquipmentForm
                        mode={panelMode}
                        initialEquipment={selectedEquipment}
                        isSubmitting={createEquipment.isPending || updateEquipment.isPending}
                        onCancel={closePanel}
                        onCreate={handleCreate}
                        onUpdate={handleUpdate}
                    />
                </Card>
            ) : null}
        </div>
    );
}

"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/shared/Button";
import { EquipmentForm } from "@/components/features/equipment/EquipmentForm";
import { EquipmentTable } from "@/components/features/equipment/EquipmentTable";
import { CrudPageTemplate } from "@/components/shared/CrudPageTemplate";
import { useCrudPanelState } from "@/hooks/useCrudPanelState";
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
    const { panelMode, selectedEntity: selectedEquipment, openCreate, openEdit, closePanel } =
        useCrudPanelState<Equipment>();

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
        <CrudPageTemplate
            title="Equipment"
            description="Track equipment inventory, status, and maintenance notes."
            addLabel="Add Equipment"
            onAdd={openCreate}
            filters={
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
            }
            isLoading={equipmentQuery.isLoading}
            isError={equipmentQuery.isError}
            errorTitle="Could not load equipment"
            errorMessage={equipmentQuery.isError ? equipmentQuery.error.userMessage : undefined}
            onRetry={() => equipmentQuery.refetch()}
            loadingText="Loading equipment..."
            tableContent={
                <EquipmentTable
                    equipment={equipment}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    isDeleting={deleteEquipment.isPending}
                />
            }
            currentPage={page}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            panelMode={panelMode}
            panelTitle={panelMode ? (panelMode === "create" ? "Create equipment" : "Edit equipment") : undefined}
            panelDescription={
                panelMode
                    ? panelMode === "create"
                        ? "Add a new equipment item to inventory."
                        : "Update equipment details and status."
                    : undefined
            }
            panelContent={
                panelMode ? (
                    <EquipmentForm
                        mode={panelMode}
                        initialEquipment={selectedEquipment}
                        isSubmitting={createEquipment.isPending || updateEquipment.isPending}
                        onCancel={closePanel}
                        onCreate={handleCreate}
                        onUpdate={handleUpdate}
                    />
                ) : null
            }
        />
    );
}

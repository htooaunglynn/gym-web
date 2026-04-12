"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/shared/Button";
import { TrainerForm } from "@/components/features/trainers/TrainerForm";
import { TrainerTable } from "@/components/features/trainers/TrainerTable";
import { CrudPageTemplate } from "@/components/shared/CrudPageTemplate";
import { useCrudPanelState } from "@/hooks/useCrudPanelState";
import { useTrainers, useCreateTrainer, useUpdateTrainer, useDeleteTrainer } from "@/hooks/useTrainers";
import { useToast } from "@/context/ToastContext";
import { PAGINATION } from "@/config/pagination";
import { CreateTrainerFormValues, UpdateTrainerFormValues } from "@/lib/validators";
import { Trainer } from "@/types/entities";

export default function TrainersPage() {
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { panelMode, selectedEntity: selectedTrainer, openCreate, openEdit, closePanel } =
        useCrudPanelState<Trainer>();

    const params = useMemo(
        () => ({
            page,
            limit: PAGINATION.trainers.limit,
            search: search || undefined,
        }),
        [page, search]
    );

    const trainersQuery = useTrainers(params);
    const createTrainer = useCreateTrainer();
    const updateTrainer = useUpdateTrainer();
    const deleteTrainer = useDeleteTrainer();

    const trainers = trainersQuery.data?.data ?? [];
    const meta = trainersQuery.data?.meta;
    const totalItems = meta?.total ?? 0;
    const pageSize = meta?.limit ?? PAGINATION.trainers.limit;

    const handleCreate = (values: CreateTrainerFormValues) => {
        createTrainer.mutate(values, {
            onSuccess: () => {
                toast.success("Trainer created");
                closePanel();
            },
            onError: (error) => {
                toast.error("Create failed", error.userMessage);
            },
        });
    };

    const handleUpdate = (values: UpdateTrainerFormValues) => {
        if (!selectedTrainer) return;

        updateTrainer.mutate(
            {
                id: selectedTrainer.id,
                payload: values,
            },
            {
                onSuccess: () => {
                    toast.success("Trainer updated");
                    closePanel();
                },
                onError: (error) => {
                    toast.error("Update failed", error.userMessage);
                },
            }
        );
    };

    const handleDelete = (trainer: Trainer) => {
        const ok = window.confirm(`Delete trainer ${trainer.firstName} ${trainer.lastName}?`);
        if (!ok) return;

        deleteTrainer.mutate(trainer.id, {
            onSuccess: () => {
                toast.success("Trainer deleted");
            },
            onError: (error) => {
                toast.error("Delete failed", error.userMessage);
            },
        });
    };

    return (
        <CrudPageTemplate
            title="Trainers"
            description="Manage trainer profiles, contact details, and assignments."
            addLabel="Add Trainer"
            onAdd={openCreate}
            filters={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by email or name"
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface placeholder-on-surface/50"
                    />

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearch("");
                            setPage(1);
                        }}
                    >
                        Reset Filters
                    </Button>
                </div>
            }
            isLoading={trainersQuery.isLoading}
            isError={trainersQuery.isError}
            errorTitle="Could not load trainers"
            errorMessage={trainersQuery.isError ? trainersQuery.error.userMessage : undefined}
            onRetry={() => trainersQuery.refetch()}
            loadingText="Loading trainers..."
            tableContent={
                <TrainerTable
                    trainers={trainers}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    isDeleting={deleteTrainer.isPending}
                />
            }
            currentPage={page}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            panelMode={panelMode}
            panelTitle={panelMode ? (panelMode === "create" ? "Create trainer" : "Edit trainer") : undefined}
            panelDescription={
                panelMode
                    ? panelMode === "create"
                        ? "Add a new trainer profile."
                        : "Update trainer details."
                    : undefined
            }
            panelContent={
                panelMode ? (
                    <TrainerForm
                        mode={panelMode}
                        initialTrainer={selectedTrainer}
                        isSubmitting={createTrainer.isPending || updateTrainer.isPending}
                        onCancel={closePanel}
                        onCreate={handleCreate}
                        onUpdate={handleUpdate}
                    />
                ) : null
            }
        />
    );
}

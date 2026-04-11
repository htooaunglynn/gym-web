"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import { TrainerForm } from "@/components/features/trainers/TrainerForm";
import { TrainerTable } from "@/components/features/trainers/TrainerTable";
import { useTrainers, useCreateTrainer, useUpdateTrainer, useDeleteTrainer } from "@/hooks/useTrainers";
import { useToast } from "@/context/ToastContext";
import { PAGINATION } from "@/config/pagination";
import { CreateTrainerFormValues, UpdateTrainerFormValues } from "@/lib/validators";
import { Trainer } from "@/types/entities";

export default function TrainersPage() {
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

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

    const openCreate = () => {
        setSelectedTrainer(null);
        setPanelMode("create");
    };

    const openEdit = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setPanelMode("edit");
    };

    const closePanel = () => {
        setSelectedTrainer(null);
        setPanelMode(null);
    };

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
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="display-lg text-on-surface">Trainers</h1>
                    <p className="text-body-md text-on-surface-variant mt-1">
                        Manage trainer profiles, contact details, and assignments.
                    </p>
                </div>

                <Button onClick={openCreate}>Add Trainer</Button>
            </div>

            <Card variant="outlined" className="space-y-4">
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

                {trainersQuery.isLoading ? (
                    <div className="py-10">
                        <LoadingSpinner text="Loading trainers..." />
                    </div>
                ) : trainersQuery.isError ? (
                    <ErrorState
                        title="Could not load trainers"
                        message={trainersQuery.error.userMessage}
                        onRetry={() => trainersQuery.refetch()}
                    />
                ) : (
                    <>
                        <TrainerTable
                            trainers={trainers}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            isDeleting={deleteTrainer.isPending}
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
                            {panelMode === "create" ? "Create trainer" : "Edit trainer"}
                        </h2>
                        <p className="text-body-md text-on-surface-variant mt-1">
                            {panelMode === "create"
                                ? "Add a new trainer profile."
                                : "Update trainer details."}
                        </p>
                    </div>

                    <TrainerForm
                        mode={panelMode}
                        initialTrainer={selectedTrainer}
                        isSubmitting={createTrainer.isPending || updateTrainer.isPending}
                        onCancel={closePanel}
                        onCreate={handleCreate}
                        onUpdate={handleUpdate}
                    />
                </Card>
            ) : null}
        </div>
    );
}

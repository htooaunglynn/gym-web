"use client";

import React, { useMemo, useState } from "react";
import { MemberForm } from "@/components/features/members/MemberForm";
import { Button } from "@/components/shared/Button";
import { MemberTable } from "@/components/features/members/MemberTable";
import { CrudPageTemplate } from "@/components/shared/CrudPageTemplate";
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from "@/hooks/useMembers";
import { useCrudPanelState } from "@/hooks/useCrudPanelState";
import { useTrainersDropdown } from "@/hooks/useTrainers";
import { useToast } from "@/context/ToastContext";
import { PAGINATION } from "@/config/pagination";
import { CreateMemberFormValues, UpdateMemberFormValues } from "@/lib/validators";
import { Member } from "@/types/entities";

export default function MembersPage() {
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [trainerId, setTrainerId] = useState("");
    const { panelMode, selectedEntity: selectedMember, openCreate, openEdit, closePanel } =
        useCrudPanelState<Member>();

    const params = useMemo(
        () => ({
            page,
            limit: PAGINATION.members.limit,
            search: search || undefined,
            trainerId: trainerId || undefined,
        }),
        [page, search, trainerId]
    );

    const membersQuery = useMembers(params);
    const trainersQuery = useTrainersDropdown();
    const createMember = useCreateMember();
    const updateMember = useUpdateMember();
    const deleteMember = useDeleteMember();

    const members = membersQuery.data?.data ?? [];
    const meta = membersQuery.data?.meta;
    const totalItems = meta?.total ?? 0;
    const pageSize = meta?.limit ?? PAGINATION.members.limit;

    const handleCreate = (values: CreateMemberFormValues) => {
        createMember.mutate(values, {
            onSuccess: () => {
                toast.success("Member created");
                closePanel();
            },
            onError: (error) => {
                toast.error("Create failed", error.userMessage);
            },
        });
    };

    const handleUpdate = (values: UpdateMemberFormValues) => {
        if (!selectedMember) return;

        updateMember.mutate(
            {
                id: selectedMember.id,
                payload: {
                    ...values,
                    trainerId: values.trainerId || null,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Member updated");
                    closePanel();
                },
                onError: (error) => {
                    toast.error("Update failed", error.userMessage);
                },
            }
        );
    };

    const handleDelete = (member: Member) => {
        const ok = window.confirm(`Delete ${member.firstName} ${member.lastName}?`);
        if (!ok) return;

        deleteMember.mutate(member.id, {
            onSuccess: () => {
                toast.success("Member deleted");
            },
            onError: (error) => {
                toast.error("Delete failed", error.userMessage);
            },
        });
    };

    return (
        <CrudPageTemplate
            title="Members"
            description="Manage member profiles, trainer assignments, and lifecycle changes."
            addLabel="Add Member"
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

                    <select
                        value={trainerId}
                        onChange={(e) => {
                            setTrainerId(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Trainers</option>
                        {(trainersQuery.data ?? []).map((trainer) => (
                            <option key={trainer.id} value={trainer.id}>
                                {trainer.label}
                            </option>
                        ))}
                    </select>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearch("");
                            setTrainerId("");
                            setPage(1);
                        }}
                    >
                        Reset Filters
                    </Button>
                </div>
            }
            isLoading={membersQuery.isLoading}
            isError={membersQuery.isError}
            errorTitle="Could not load members"
            errorMessage={membersQuery.isError ? membersQuery.error.userMessage : undefined}
            onRetry={() => membersQuery.refetch()}
            loadingText="Loading members..."
            tableContent={
                <MemberTable
                    members={members}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    isDeleting={deleteMember.isPending}
                />
            }
            currentPage={page}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            panelMode={panelMode}
            panelTitle={panelMode ? (panelMode === "create" ? "Create member" : "Edit member") : undefined}
            panelDescription={
                panelMode
                    ? panelMode === "create"
                        ? "Create a new membership profile."
                        : "Update profile details and trainer assignment."
                    : undefined
            }
            panelContent={
                panelMode ? (
                    <MemberForm
                        mode={panelMode}
                        initialMember={selectedMember}
                        trainers={trainersQuery.data ?? []}
                        isSubmitting={createMember.isPending || updateMember.isPending}
                        onCancel={closePanel}
                        onCreate={handleCreate}
                        onUpdate={handleUpdate}
                    />
                ) : null
            }
        />
    );
}

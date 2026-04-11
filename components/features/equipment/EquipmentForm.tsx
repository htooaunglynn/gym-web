"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createEquipmentSchema,
    updateEquipmentSchema,
    CreateEquipmentFormValues,
    UpdateEquipmentFormValues,
} from "@/lib/validators";
import { Equipment } from "@/types/entities";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";

interface EquipmentFormProps {
    mode: "create" | "edit";
    initialEquipment?: Equipment | null;
    isSubmitting?: boolean;
    onCancel: () => void;
    onCreate: (values: CreateEquipmentFormValues) => void;
    onUpdate: (values: UpdateEquipmentFormValues) => void;
}

const STATUS_OPTIONS = ["OPERATIONAL", "UNDER_MAINTENANCE", "DAMAGED", "RETIRED"] as const;

export function EquipmentForm({
    mode,
    initialEquipment,
    isSubmitting = false,
    onCancel,
    onCreate,
    onUpdate,
}: EquipmentFormProps) {
    const isEdit = mode === "edit";

    const createForm = useForm<CreateEquipmentFormValues>({
        resolver: zodResolver(createEquipmentSchema),
        defaultValues: {
            name: "",
            category: "",
            quantity: 0,
            status: "OPERATIONAL",
            notes: "",
        },
    });

    const updateForm = useForm<UpdateEquipmentFormValues>({
        resolver: zodResolver(updateEquipmentSchema),
        defaultValues: {
            name: "",
            category: "",
            status: "OPERATIONAL",
            notes: "",
        },
    });

    useEffect(() => {
        if (isEdit) {
            updateForm.reset({
                name: initialEquipment?.name ?? "",
                category: initialEquipment?.category ?? "",
                status: initialEquipment?.status ?? "OPERATIONAL",
                notes: initialEquipment?.notes ?? "",
            });
        } else {
            createForm.reset({
                name: "",
                category: "",
                quantity: 0,
                status: "OPERATIONAL",
                notes: "",
            });
        }
    }, [isEdit, initialEquipment, createForm, updateForm]);

    if (isEdit) {
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = updateForm;

        return (
            <form className="space-y-4" onSubmit={handleSubmit((values) => onUpdate(values))} noValidate>
                <Input
                    label="Equipment name"
                    placeholder="Bench Press"
                    error={errors.name?.message}
                    {...register("name")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-label-md font-semibold text-on-surface mb-2">Category</label>
                        <select
                            className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                            {...register("category")}
                        >
                            <option value="">Select category</option>
                            {EQUIPMENT_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category?.message ? (
                            <p className="text-error text-label-md mt-1">{errors.category.message}</p>
                        ) : null}
                    </div>

                    <div>
                        <label className="block text-label-md font-semibold text-on-surface mb-2">Status</label>
                        <select
                            className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                            {...register("status")}
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                    {status.replace(/_/g, " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Notes</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface placeholder-on-surface/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                        placeholder="Optional equipment notes"
                        {...register("notes")}
                    />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        Update equipment
                    </Button>
                </div>
            </form>
        );
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = createForm;

    return (
        <form className="space-y-4" onSubmit={handleSubmit((values) => onCreate(values))} noValidate>
            <Input
                label="Equipment name"
                placeholder="Bench Press"
                error={errors.name?.message}
                {...register("name")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Category</label>
                    <select
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                        {...register("category")}
                    >
                        <option value="">Select category</option>
                        {EQUIPMENT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    {errors.category?.message ? (
                        <p className="text-error text-label-md mt-1">{errors.category.message}</p>
                    ) : null}
                </div>

                <Input
                    label="Quantity"
                    type="number"
                    min={0}
                    error={errors.quantity?.message}
                    {...register("quantity", {
                        valueAsNumber: true,
                        onChange: (e) => setValue("quantity", Number(e.target.value)),
                    })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Status</label>
                    <select
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                        {...register("status")}
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Notes</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface placeholder-on-surface/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                        placeholder="Optional equipment notes"
                        {...register("notes")}
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    Create equipment
                </Button>
            </div>
        </form>
    );
}

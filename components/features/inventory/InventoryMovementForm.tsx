"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventoryMovementSchema, InventoryMovementFormValues } from "@/lib/validators";
import { Button } from "@/components/shared/Button";

type MovementMode = "incoming" | "outgoing" | "adjustment";

type EquipmentOption = {
    id: string;
    label: string;
};

interface InventoryMovementFormProps {
    mode: MovementMode;
    equipment: EquipmentOption[];
    isSubmitting?: boolean;
    onSubmit: (values: InventoryMovementFormValues) => void;
}

const modeMeta: Record<MovementMode, { title: string; button: string }> = {
    incoming: { title: "Incoming Stock", button: "Record Incoming" },
    outgoing: { title: "Outgoing Stock", button: "Record Outgoing" },
    adjustment: { title: "Stock Adjustment", button: "Record Adjustment" },
};

export function InventoryMovementForm({
    mode,
    equipment,
    isSubmitting = false,
    onSubmit,
}: InventoryMovementFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InventoryMovementFormValues>({
        resolver: zodResolver(inventoryMovementSchema),
        defaultValues: {
            equipmentId: "",
            quantity: 1,
            notes: "",
        },
    });

    return (
        <form className="space-y-3" onSubmit={handleSubmit((values) => onSubmit(values))} noValidate>
            <h3 className="title-md text-on-surface">{modeMeta[mode].title}</h3>

            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Equipment</label>
                <select
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    {...register("equipmentId")}
                >
                    <option value="">Select equipment</option>
                    {equipment.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.label}
                        </option>
                    ))}
                </select>
                {errors.equipmentId?.message ? (
                    <p className="text-error text-label-md mt-1">{errors.equipmentId.message}</p>
                ) : null}
            </div>

            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Quantity</label>
                <input
                    type="number"
                    min={1}
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    {...register("quantity", { valueAsNumber: true })}
                />
                {errors.quantity?.message ? (
                    <p className="text-error text-label-md mt-1">{errors.quantity.message}</p>
                ) : null}
            </div>

            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Notes</label>
                <textarea
                    rows={2}
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface placeholder-on-surface/50"
                    placeholder="Optional note"
                    {...register("notes")}
                />
            </div>

            <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                {modeMeta[mode].button}
            </Button>
        </form>
    );
}

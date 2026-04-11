"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createTrainerSchema,
    updateTrainerSchema,
    CreateTrainerFormValues,
    UpdateTrainerFormValues,
} from "@/lib/validators";
import { Trainer } from "@/types/entities";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";

interface TrainerFormProps {
    mode: "create" | "edit";
    initialTrainer?: Trainer | null;
    isSubmitting?: boolean;
    onCancel: () => void;
    onCreate: (values: CreateTrainerFormValues) => void;
    onUpdate: (values: UpdateTrainerFormValues) => void;
}

export function TrainerForm({
    mode,
    initialTrainer,
    isSubmitting = false,
    onCancel,
    onCreate,
    onUpdate,
}: TrainerFormProps) {
    const isEdit = mode === "edit";

    const createForm = useForm<CreateTrainerFormValues>({
        resolver: zodResolver(createTrainerSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
        },
    });

    const updateForm = useForm<UpdateTrainerFormValues>({
        resolver: zodResolver(updateTrainerSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
        },
    });

    useEffect(() => {
        if (isEdit) {
            updateForm.reset({
                email: initialTrainer?.email ?? "",
                firstName: initialTrainer?.firstName ?? "",
                lastName: initialTrainer?.lastName ?? "",
                phone: initialTrainer?.phone ?? "",
            });
        } else {
            createForm.reset({
                email: "",
                firstName: "",
                lastName: "",
                phone: "",
            });
        }
    }, [isEdit, initialTrainer, createForm, updateForm]);

    if (isEdit) {
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = updateForm;

        return (
            <form className="space-y-4" onSubmit={handleSubmit((values) => onUpdate(values))} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First name"
                        placeholder="Chris"
                        error={errors.firstName?.message}
                        {...register("firstName")}
                    />
                    <Input
                        label="Last name"
                        placeholder="Evans"
                        error={errors.lastName?.message}
                        {...register("lastName")}
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    placeholder="trainer@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Input
                    label="Phone"
                    placeholder="+1 555 111-2222"
                    error={errors.phone?.message}
                    {...register("phone")}
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        Update trainer
                    </Button>
                </div>
            </form>
        );
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = createForm;

    return (
        <form className="space-y-4" onSubmit={handleSubmit((values) => onCreate(values))} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="First name"
                    placeholder="Chris"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                />
                <Input
                    label="Last name"
                    placeholder="Evans"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                />
            </div>

            <Input
                label="Email"
                type="email"
                placeholder="trainer@example.com"
                error={errors.email?.message}
                {...register("email")}
            />

            <Input
                label="Phone"
                placeholder="+1 555 111-2222"
                error={errors.phone?.message}
                {...register("phone")}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    Create trainer
                </Button>
            </div>
        </form>
    );
}

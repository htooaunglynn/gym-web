"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createMemberSchema,
    updateMemberSchema,
    CreateMemberFormValues,
    UpdateMemberFormValues,
} from "@/lib/validators";
import { Member } from "@/types/entities";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";

type TrainerOption = { id: string; label: string };

interface MemberFormProps {
    mode: "create" | "edit";
    trainers: TrainerOption[];
    initialMember?: Member | null;
    isSubmitting?: boolean;
    onCancel: () => void;
    onCreate: (values: CreateMemberFormValues) => void;
    onUpdate: (values: UpdateMemberFormValues) => void;
}

export function MemberForm({
    mode,
    trainers,
    initialMember,
    isSubmitting = false,
    onCancel,
    onCreate,
    onUpdate,
}: MemberFormProps) {
    const isEdit = mode === "edit";

    const createForm = useForm<CreateMemberFormValues>({
        resolver: zodResolver(createMemberSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            password: "",
            trainerId: "",
        },
    });

    const updateForm = useForm<UpdateMemberFormValues>({
        resolver: zodResolver(updateMemberSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            trainerId: null,
        },
    });

    useEffect(() => {
        if (isEdit) {
            updateForm.reset({
                email: initialMember?.email ?? "",
                firstName: initialMember?.firstName ?? "",
                lastName: initialMember?.lastName ?? "",
                phone: initialMember?.phone ?? "",
                trainerId: initialMember?.trainerId ?? null,
            });
        } else {
            createForm.reset({
                email: "",
                firstName: "",
                lastName: "",
                phone: "",
                password: "",
                trainerId: "",
            });
        }
    }, [isEdit, initialMember, createForm, updateForm]);

    if (isEdit) {
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = updateForm;

        return (
            <form
                className="space-y-4"
                onSubmit={handleSubmit((values) => onUpdate(values))}
                noValidate
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First name"
                        placeholder="Alex"
                        error={errors.firstName?.message}
                        {...register("firstName")}
                    />
                    <Input
                        label="Last name"
                        placeholder="Johnson"
                        error={errors.lastName?.message}
                        {...register("lastName")}
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    placeholder="member@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Input
                    label="Phone"
                    placeholder="+1 555 000-1234"
                    error={errors.phone?.message}
                    {...register("phone")}
                />

                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Trainer</label>
                    <select
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                        {...register("trainerId")}
                    >
                        <option value="">Unassigned</option>
                        {trainers.map((trainer) => (
                            <option key={trainer.id} value={trainer.id}>
                                {trainer.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        Update member
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
        <form
            className="space-y-4"
            onSubmit={handleSubmit((values) => {
                onCreate(values);
            })}
            noValidate
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="First name"
                    placeholder="Alex"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                />
                <Input
                    label="Last name"
                    placeholder="Johnson"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                />
            </div>

            <Input
                label="Email"
                type="email"
                placeholder="member@example.com"
                error={errors.email?.message}
                {...register("email")}
            />

            <Input
                label="Phone"
                placeholder="+1 555 000-1234"
                error={errors.phone?.message}
                {...register("phone")}
            />

            <Input
                label="Password"
                type="password"
                placeholder="Min. 8 chars with uppercase + number"
                error={errors.password?.message}
                {...register("password")}
            />

            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Trainer</label>
                <select
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                    {...register("trainerId")}
                >
                    <option value="">Unassigned</option>
                    {trainers.map((trainer) => (
                        <option key={trainer.id} value={trainer.id}>
                            {trainer.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    Create member
                </Button>
            </div>
        </form>
    );
}

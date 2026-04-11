"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPaymentSchema, CreatePaymentFormValues } from "@/lib/validators";
import { Button } from "@/components/shared/Button";

type MemberOption = { id: string; label: string };

interface PaymentFormProps {
    members: MemberOption[];
    isSubmitting?: boolean;
    onSubmit: (values: CreatePaymentFormValues) => void;
}

const PAYMENT_METHODS = ["CASH", "CARD", "BANK_TRANSFER", "MOBILE"] as const;
const PAYMENT_STATUSES = ["PAID", "PENDING", "FAILED", "REFUNDED"] as const;

export function PaymentForm({ members, isSubmitting = false, onSubmit }: PaymentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreatePaymentFormValues>({
        resolver: zodResolver(createPaymentSchema),
        defaultValues: {
            memberId: "",
            amount: 0,
            currency: "USD",
            method: "CARD",
            status: "PAID",
            paidAt: "",
            notes: "",
        },
    });

    return (
        <form className="space-y-3" onSubmit={handleSubmit((values) => onSubmit(values))} noValidate>
            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Member</label>
                <select
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    {...register("memberId")}
                >
                    <option value="">Select member</option>
                    {members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.label}
                        </option>
                    ))}
                </select>
                {errors.memberId?.message ? <p className="text-error text-label-md mt-1">{errors.memberId.message}</p> : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Amount</label>
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                        {...register("amount", { valueAsNumber: true })}
                    />
                    {errors.amount?.message ? <p className="text-error text-label-md mt-1">{errors.amount.message}</p> : null}
                </div>

                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Currency</label>
                    <input
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                        maxLength={3}
                        {...register("currency")}
                    />
                </div>

                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Paid At</label>
                    <input
                        type="datetime-local"
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                        {...register("paidAt")}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Method</label>
                    <select
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                        {...register("method")}
                    >
                        {PAYMENT_METHODS.map((method) => (
                            <option key={method} value={method}>
                                {method.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Status</label>
                    <select
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                        {...register("status")}
                    >
                        {PAYMENT_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Notes</label>
                <textarea
                    rows={2}
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface placeholder-on-surface/50"
                    placeholder="Optional payment note"
                    {...register("notes")}
                />
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                Record Payment
            </Button>
        </form>
    );
}

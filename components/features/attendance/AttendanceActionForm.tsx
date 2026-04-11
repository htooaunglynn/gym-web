"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    checkInSchema,
    checkOutSchema,
    correctionSchema,
    CheckInFormValues,
    CheckOutFormValues,
    CorrectionFormValues,
} from "@/lib/validators";
import { Button } from "@/components/shared/Button";

type MemberOption = { id: string; label: string };

type AttendanceMode = "checkIn" | "checkOut" | "correction";

interface AttendanceActionFormProps {
    mode: AttendanceMode;
    members: MemberOption[];
    isSubmitting?: boolean;
    onSubmit: (values: CheckInFormValues | CheckOutFormValues | CorrectionFormValues) => void;
}

export function AttendanceActionForm({
    mode,
    members,
    isSubmitting = false,
    onSubmit,
}: AttendanceActionFormProps) {
    if (mode === "correction") {
        return <CorrectionForm members={members} isSubmitting={isSubmitting} onSubmit={onSubmit} />;
    }

    return (
        <CheckInOutForm
            mode={mode}
            members={members}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
        />
    );
}

function CheckInOutForm({
    mode,
    members,
    isSubmitting,
    onSubmit,
}: {
    mode: "checkIn" | "checkOut";
    members: MemberOption[];
    isSubmitting: boolean;
    onSubmit: (values: CheckInFormValues | CheckOutFormValues) => void;
}) {
    const schema = mode === "checkIn" ? checkInSchema : checkOutSchema;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckInFormValues | CheckOutFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            memberId: "",
            timestamp: "",
            notes: "",
        },
    });

    return (
        <form className="space-y-3" onSubmit={handleSubmit((values) => onSubmit(values))} noValidate>
            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Member</label>
                <select
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                    {...register("memberId")}
                >
                    <option value="">Select member</option>
                    {members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.label}
                        </option>
                    ))}
                </select>
                {errors.memberId?.message ? (
                    <p className="text-error text-label-md mt-1">{errors.memberId.message}</p>
                ) : null}
            </div>

            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Timestamp (optional)</label>
                <input
                    type="datetime-local"
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    {...register("timestamp")}
                />
            </div>

            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Notes</label>
                <textarea
                    rows={2}
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface placeholder-on-surface/50"
                    placeholder="Optional notes"
                    {...register("notes")}
                />
            </div>

            <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                {mode === "checkIn" ? "Check In" : "Check Out"}
            </Button>
        </form>
    );
}

function CorrectionForm({
    members,
    isSubmitting,
    onSubmit,
}: {
    members: MemberOption[];
    isSubmitting: boolean;
    onSubmit: (values: CorrectionFormValues) => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CorrectionFormValues>({
        resolver: zodResolver(correctionSchema),
        defaultValues: {
            memberId: "",
            type: "CHECK_IN",
            timestamp: "",
            notes: "",
        },
    });

    return (
        <form className="space-y-3" onSubmit={handleSubmit((values) => onSubmit(values))} noValidate>
            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Member</label>
                <select
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-default"
                    {...register("memberId")}
                >
                    <option value="">Select member</option>
                    {members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.label}
                        </option>
                    ))}
                </select>
                {errors.memberId?.message ? (
                    <p className="text-error text-label-md mt-1">{errors.memberId.message}</p>
                ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Type</label>
                    <select
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                        {...register("type")}
                    >
                        <option value="CHECK_IN">Check In</option>
                        <option value="CHECK_OUT">Check Out</option>
                    </select>
                </div>

                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2">Timestamp</label>
                    <input
                        type="datetime-local"
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                        {...register("timestamp")}
                    />
                    {errors.timestamp?.message ? (
                        <p className="text-error text-label-md mt-1">{errors.timestamp.message}</p>
                    ) : null}
                </div>
            </div>

            <div>
                <label className="block text-label-md font-semibold text-on-surface mb-2">Notes</label>
                <textarea
                    rows={2}
                    className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface placeholder-on-surface/50"
                    placeholder="Reason for correction"
                    {...register("notes")}
                />
            </div>

            <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                Create Correction
            </Button>
        </form>
    );
}

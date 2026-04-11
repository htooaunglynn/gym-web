"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import { PaymentForm } from "@/components/features/payments/PaymentForm";
import { PaymentTable } from "@/components/features/payments/PaymentTable";
import { usePayments, useCreatePayment } from "@/hooks/usePayments";
import { useMembers } from "@/hooks/useMembers";
import { useToast } from "@/context/ToastContext";
import { CreatePaymentFormValues } from "@/lib/validators";

const PAGE_LIMIT = 20;

function toIsoIfProvided(value?: string) {
    if (!value) return undefined;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export default function PaymentsPage() {
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [method, setMethod] = useState("");
    const [memberId, setMemberId] = useState("");
    const [showForm, setShowForm] = useState(false);

    const membersQuery = useMembers({ page: 1, limit: 300 });

    const paymentParams = useMemo(
        () => ({
            page,
            limit: PAGE_LIMIT,
            status: status || undefined,
            method: method || undefined,
            memberId: memberId || undefined,
        }),
        [page, status, method, memberId]
    );

    const paymentsQuery = usePayments(paymentParams);
    const createPayment = useCreatePayment();

    const payments = paymentsQuery.data?.data ?? [];
    const meta = paymentsQuery.data?.meta;
    const totalItems = meta?.total ?? 0;
    const pageSize = meta?.limit ?? PAGE_LIMIT;

    const memberOptions = (membersQuery.data?.data ?? []).map((m) => ({
        id: m.id,
        label: `${m.firstName} ${m.lastName}`,
    }));

    const handleCreate = (values: CreatePaymentFormValues) => {
        createPayment.mutate(
            {
                memberId: values.memberId,
                amount: values.amount,
                currency: values.currency,
                method: values.method,
                status: values.status,
                paidAt: toIsoIfProvided(values.paidAt),
                notes: values.notes,
            },
            {
                onSuccess: () => {
                    toast.success("Payment recorded");
                    setShowForm(false);
                },
                onError: (error) => {
                    toast.error("Payment failed", error.userMessage);
                },
            }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="display-lg text-on-surface">Payments</h1>
                    <p className="text-body-md text-on-surface-variant mt-1">
                        Track transactions and monitor payment status for all members.
                    </p>
                </div>

                <Button onClick={() => setShowForm((p) => !p)}>
                    {showForm ? "Close Form" : "Record Payment"}
                </Button>
            </div>

            {showForm ? (
                <Card variant="outlined">
                    <PaymentForm
                        members={memberOptions}
                        isSubmitting={createPayment.isPending}
                        onSubmit={handleCreate}
                    />
                </Card>
            ) : null}

            <Card variant="outlined" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                        value={memberId}
                        onChange={(e) => {
                            setMemberId(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Members</option>
                        {memberOptions.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Statuses</option>
                        <option value="PAID">PAID</option>
                        <option value="PENDING">PENDING</option>
                        <option value="FAILED">FAILED</option>
                        <option value="REFUNDED">REFUNDED</option>
                    </select>

                    <select
                        value={method}
                        onChange={(e) => {
                            setMethod(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-4 py-2 rounded-md bg-surface-container-highest/40 border border-outline-variant/30 text-on-surface"
                    >
                        <option value="">All Methods</option>
                        <option value="CASH">CASH</option>
                        <option value="CARD">CARD</option>
                        <option value="BANK_TRANSFER">BANK TRANSFER</option>
                        <option value="MOBILE">MOBILE</option>
                    </select>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setMemberId("");
                            setStatus("");
                            setMethod("");
                            setPage(1);
                        }}
                    >
                        Reset Filters
                    </Button>
                </div>

                {paymentsQuery.isLoading ? (
                    <div className="py-10">
                        <LoadingSpinner text="Loading payments..." />
                    </div>
                ) : paymentsQuery.isError ? (
                    <ErrorState
                        title="Could not load payments"
                        message={paymentsQuery.error.userMessage}
                        onRetry={() => paymentsQuery.refetch()}
                    />
                ) : (
                    <>
                        <PaymentTable payments={payments} />
                        <Pagination
                            currentPage={page}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </Card>
        </div>
    );
}

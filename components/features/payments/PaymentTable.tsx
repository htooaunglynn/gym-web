import React from "react";
import { Payment } from "@/types/entities";
import { Badge } from "@/components/shared/Badge";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

interface PaymentTableProps {
    payments: Payment[];
}

const statusVariant: Record<Payment["status"], "success" | "warning" | "error" | "info"> = {
    PAID: "success",
    PENDING: "warning",
    FAILED: "error",
    REFUNDED: "info",
};

export function PaymentTable({ payments }: PaymentTableProps) {
    return (
        <div className="overflow-x-auto rounded-md border border-outline-variant/30">
            <table className="w-full min-w-[980px]">
                <caption className="sr-only">Payments history including method, status, and amount</caption>
                <thead className="bg-surface-container-low">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Member</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Amount</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Method</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Paid At</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Notes</th>
                    </tr>
                </thead>

                <tbody>
                    {payments.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                                No payments found.
                            </td>
                        </tr>
                    ) : (
                        payments.map((payment) => (
                            <tr key={payment.id} className="border-t border-outline-variant/20">
                                <td className="px-4 py-3 text-body-md font-semibold text-on-surface">
                                    {payment.member
                                        ? `${payment.member.firstName} ${payment.member.lastName}`
                                        : payment.memberId}
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface">
                                    {formatCurrency(payment.amount, payment.currency)}
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface">
                                    {payment.method.replace(/_/g, " ")}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={statusVariant[payment.status]} size="sm">
                                        {payment.status}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface-variant">
                                    {formatDateTime(payment.paidAt)}
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface-variant">
                                    {payment.notes || "-"}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

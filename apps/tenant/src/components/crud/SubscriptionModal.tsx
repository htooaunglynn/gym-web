"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { MemberSelect } from "@/components/forms/MemberSelect";
import { PlanSelect } from "@/components/forms/PlanSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MemberSubscription {
    id: string;
    memberId: string;
    membershipPlanId: string;
    status: "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    paymentMethod?: "CASH" | "CARD" | "BANK_TRANSFER" | "ONLINE";
    paymentReference?: string;
    paidAt?: string;
    note?: string;
    startDate: string;
    endDate: string;
    member?: { firstName: string; lastName: string };
    membershipPlan?: { name: string };
    createdAt: string;
}

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "ONLINE";

export interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    /** undefined = create mode, defined = edit mode */
    subscription?: MemberSubscription;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format an ISO date string (or datetime) to YYYY-MM-DD for <input type="date"> */
function toDateInputValue(dateStr: string): string {
    if (!dateStr) return "";
    return dateStr.slice(0, 10);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SubscriptionModal({
    isOpen,
    onClose,
    onSuccess,
    subscription,
}: SubscriptionModalProps) {
    const isEditMode = Boolean(subscription);

    const [memberId, setMemberId] = useState<string>("");
    const [membershipPlanId, setMembershipPlanId] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
    const [paymentReference, setPaymentReference] = useState<string>("");
    const [paidAt, setPaidAt] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const dialogRef = useRef<HTMLDivElement>(null);

    // Pre-populate fields in edit mode (or reset in create mode) when modal opens
    useEffect(() => {
        if (isOpen) {
            if (subscription) {
                setMemberId(subscription.memberId);
                setMembershipPlanId(subscription.membershipPlanId);
                setStartDate(toDateInputValue(subscription.startDate));
                setEndDate(toDateInputValue(subscription.endDate));
                setPaymentStatus(subscription.paymentStatus ?? "PENDING");
                setPaymentMethod(subscription.paymentMethod ?? "CASH");
                setPaymentReference(subscription.paymentReference ?? "");
                setPaidAt(
                    subscription.paidAt
                        ? new Date(subscription.paidAt).toISOString().slice(0, 16)
                        : "",
                );
                setNote(subscription.note ?? "");
            } else {
                setMemberId("");
                setMembershipPlanId("");
                setStartDate("");
                setEndDate("");
                setPaymentStatus("PENDING");
                setPaymentMethod("CASH");
                setPaymentReference("");
                setPaidAt("");
                setNote("");
            }
            setValidationError(null);
        }
    }, [isOpen, subscription]);

    // Escape key closes the modal
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        },
        [isOpen, onClose],
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    if (!isOpen) return null;

    // ── Submit ──────────────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // Client-side validation
        if (!memberId) {
            setValidationError("Please select a member.");
            return;
        }
        if (!membershipPlanId) {
            setValidationError("Please select a membership plan.");
            return;
        }
        if (!startDate) {
            setValidationError("Please enter a start date.");
            return;
        }
        if (endDate && endDate < startDate) {
            setValidationError("End date cannot be earlier than start date.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                memberId,
                membershipPlanId,
                startDate,
                ...(endDate ? { endDate } : {}),
                paymentStatus,
                paymentMethod,
                ...(paymentReference.trim()
                    ? { paymentReference: paymentReference.trim() }
                    : {}),
                ...(paidAt ? { paidAt: new Date(paidAt).toISOString() } : {}),
                ...(note.trim() ? { note: note.trim() } : {}),
            };

            if (isEditMode && subscription) {
                await apiClient(`/member-subscriptions/${subscription.id}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
            } else {
                await apiClient("/member-subscriptions", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }

            onSuccess();
            onClose();
        } catch {
            // apiClient already shows an error toast; keep modal open
        } finally {
            setLoading(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            role="presentation"
            onClick={(e) => {
                // Close when clicking the backdrop (not the dialog itself)
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Dialog panel */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="subscription-modal-title"
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl shadow-black/10 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2
                        id="subscription-modal-title"
                        className="text-xl font-bold text-gray-900"
                    >
                        {isEditMode ? "Edit Subscription" : "New Subscription"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {/* Validation error */}
                    {validationError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                            {validationError}
                        </div>
                    )}

                    {/* Member */}
                    <MemberSelect
                        label="Member *"
                        selectedMemberId={memberId || undefined}
                        onSelect={(member) => setMemberId(member?.id ?? "")}
                    />

                    {/* Membership Plan */}
                    <PlanSelect
                        label="Membership Plan *"
                        selectedPlanId={membershipPlanId || undefined}
                        onSelect={(plan) => setMembershipPlanId(plan?.id ?? "")}
                    />

                    {/* Start Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label
                                htmlFor="sub-start-date"
                                className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
                            >
                                Start Date *
                            </label>
                            <input
                                id="sub-start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="sub-end-date"
                                className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
                            >
                                End Date
                            </label>
                            <input
                                id="sub-end-date"
                                type="date"
                                value={endDate}
                                min={startDate || undefined}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
                            />
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div>
                        <label
                            htmlFor="sub-payment-status"
                            className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
                        >
                            Payment Status *
                        </label>
                        <select
                            id="sub-payment-status"
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm bg-white"
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="FAILED">FAILED</option>
                            <option value="REFUNDED">REFUNDED</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="sub-payment-method"
                            className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
                        >
                            Payment Method
                        </label>
                        <select
                            id="sub-payment-method"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm bg-white"
                        >
                            <option value="CASH">CASH</option>
                            <option value="CARD">CARD</option>
                            <option value="BANK_TRANSFER">BANK TRANSFER</option>
                            <option value="ONLINE">ONLINE</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label
                                htmlFor="sub-payment-reference"
                                className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
                            >
                                Payment Reference
                            </label>
                            <input
                                id="sub-payment-reference"
                                type="text"
                                value={paymentReference}
                                maxLength={191}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                placeholder="Receipt/Txn ID"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="sub-paid-at"
                                className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
                            >
                                Paid At
                            </label>
                            <input
                                id="sub-paid-at"
                                type="datetime-local"
                                value={paidAt}
                                onChange={(e) => setPaidAt(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="sub-note"
                            className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
                        >
                            Note
                        </label>
                        <textarea
                            id="sub-note"
                            rows={3}
                            value={note}
                            maxLength={500}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-[#FF5C39] hover:bg-[#E84C4C] text-white text-sm font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50"
                        >
                            {loading
                                ? isEditMode
                                    ? "Saving…"
                                    : "Creating…"
                                : isEditMode
                                    ? "Save Changes"
                                    : "Create Subscription"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface AddInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddInventoryModal({
    isOpen,
    onClose,
    onSuccess,
}: AddInventoryModalProps) {
    const [actionType, setActionType] = useState<
        "incoming" | "outgoing" | "adjustments"
    >("incoming");

    const [formData, setFormData] = useState({
        equipmentId: "",
        quantity: "1",
        occurredAt: new Date().toISOString().slice(0, 16),
        reason: "",
        note: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quantityError, setQuantityError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        if (e.target.name === "quantity") {
            setQuantityError(null);
        }
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side quantity validation — requirement 8.6
        const parsedQty = parseInt(formData.quantity, 10);
        const minAllowedQty = actionType === "adjustments" ? 0 : 1;
        if (isNaN(parsedQty) || parsedQty < minAllowedQty) {
            setQuantityError(
                actionType === "adjustments"
                    ? "Target quantity must be 0 or greater."
                    : "Quantity must be at least 1.",
            );
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Base payload
            const payload: {
                equipmentId: string;
                occurredAt: string;
                reason: string;
                note: string;
                quantity?: number;
                targetQuantity?: number;
            } = {
                equipmentId: formData.equipmentId,
                occurredAt: new Date(formData.occurredAt).toISOString(),
                reason: formData.reason,
                note: formData.note,
            };

            // Adjustments API specifically wants `targetQuantity` instead of `quantity`
            if (actionType === "adjustments") {
                payload.targetQuantity = parseInt(formData.quantity, 10);
            } else {
                payload.quantity = parseInt(formData.quantity, 10);
            }

            await apiClient(`/inventory-movements/${actionType}`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setFormData({
                equipmentId: "",
                quantity: "1",
                occurredAt: new Date().toISOString().slice(0, 16),
                reason: "",
                note: "",
            });
            setQuantityError(null);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden shadow-black/10">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Record Movement</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Action Tabs Menu */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setActionType("incoming")}
                            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${actionType === "incoming" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            INCOMING
                        </button>
                        <button
                            type="button"
                            onClick={() => setActionType("outgoing")}
                            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${actionType === "outgoing" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            OUTGOING
                        </button>
                        <button
                            type="button"
                            onClick={() => setActionType("adjustments")}
                            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${actionType === "adjustments" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            ADJUST
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                            Equipment ID Target
                        </label>
                        <input
                            type="text"
                            name="equipmentId"
                            placeholder="UUID"
                            value={formData.equipmentId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors font-mono text-sm"
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div className="flex-[0.4]">
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                                {actionType === "adjustments" ? "Target Qty" : "Quantity"}
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                min={actionType === "adjustments" ? "0" : "1"}
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none transition-colors text-sm font-mono ${quantityError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-gray-900"}`}
                            />
                            {quantityError && (
                                <p className="mt-1 text-xs text-red-600">{quantityError}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                                Timestamp
                            </label>
                            <input
                                type="datetime-local"
                                name="occurredAt"
                                value={formData.occurredAt}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                            Reason
                        </label>
                        <input
                            type="text"
                            name="reason"
                            placeholder="e.g. Restock, Session Use"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3">
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
                            className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50"
                        >
                            {loading ? "Recording..." : "Save Movement"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import type { BillingCycle, MembershipPlan } from "@/types/membership-plan";

const EMPTY_FEATURE = "";

function sanitizeFeatures(features: string[]) {
    return [...new Set(features.map((feature) => feature.trim()).filter(Boolean))];
}

interface PlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    plan?: MembershipPlan;
}

export function PlanModal({
    isOpen,
    onClose,
    onSuccess,
    plan,
}: PlanModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        amount: "",
        billingCycle: "MONTHLY" as BillingCycle,
        isActive: true,
    });
    const [features, setFeatures] = useState<string[]>([EMPTY_FEATURE]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name || "",
                description: plan.description || "",
                amount: plan.amount?.toString() || "",
                billingCycle: plan.billingCycle || "MONTHLY",
                isActive: plan.isActive !== undefined ? plan.isActive : true,
            });
            setFeatures(plan.features.length > 0 ? plan.features : [EMPTY_FEATURE]);
        } else {
            setFormData({
                name: "",
                description: "",
                amount: "",
                billingCycle: "MONTHLY",
                isActive: true,
            });
            setFeatures([EMPTY_FEATURE]);
        }
    }, [plan, isOpen]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const parsedAmount = Number.parseFloat(formData.amount);
        if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
            setError("Please provide a valid non-negative amount.");
            setLoading(false);
            return;
        }

        const sanitizedFeatures = sanitizeFeatures(features);
        if (sanitizedFeatures.length === 0) {
            setError("Please add at least one feature.");
            setLoading(false);
            return;
        }

        try {
            const method = plan ? "PATCH" : "POST";
            const path = plan ? `/membership-plans/${plan.id}` : "/membership-plans";

            await apiClient(path, {
                method,
                body: JSON.stringify({
                    ...formData,
                    amount: parsedAmount.toString(),
                    features: sanitizedFeatures,
                }),
            });

            onSuccess();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleFeatureChange = (index: number, value: string) => {
        setFeatures((currentFeatures) =>
            currentFeatures.map((feature, currentIndex) =>
                currentIndex === index ? value : feature,
            ),
        );
    };

    const handleAddFeature = () => {
        setFeatures((currentFeatures) => [...currentFeatures, EMPTY_FEATURE]);
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures((currentFeatures) => {
            const nextFeatures = currentFeatures.filter(
                (_, currentIndex) => currentIndex !== index,
            );

            return nextFeatures.length > 0 ? nextFeatures : [EMPTY_FEATURE];
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {plan ? "Edit Plan" : "New Membership Plan"}
                    </h2>
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

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                            Plan Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Monthly Standard"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm font-semibold"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="What's included in this plan?"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Features
                            </label>
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Feature
                            </button>
                        </div>

                        <div className="space-y-2.5 rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                            {features.map((feature, index) => (
                                <div key={`${index}-${feature}`} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. 24/7 gym access"
                                        value={feature}
                                        onChange={(e) =>
                                            handleFeatureChange(index, e.target.value)
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-colors focus:border-gray-900 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(index)}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-gray-400 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                                        aria-label={`Remove feature ${index + 1}`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="mt-2 text-xs font-medium text-gray-400">
                            Add, edit, or remove the benefits included in this membership plan.
                        </p>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                                Amount ($)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm font-mono"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                                Billing Cycle
                            </label>
                            <select
                                name="billingCycle"
                                value={formData.billingCycle}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm bg-white"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="QUARTERLY">Quarterly</option>
                                <option value="YEARLY">Yearly</option>
                                <option value="WEEKLY">Weekly</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-8">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-300 accent-gray-900"
                        />
                        <label
                            htmlFor="isActive"
                            className="text-sm font-semibold text-gray-700 cursor-pointer"
                        >
                            Active and visible on landing page
                        </label>
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
                            {loading ? "Processing..." : plan ? "Update Plan" : "Create Plan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Check, CreditCard } from "lucide-react";
import {
    apiClient,
    normalizeListResponse,
    PaginationResponse,
} from "@/lib/apiClient";

interface MembershipPlan {
    id: string;
    name: string;
    description?: string;
    amount: number;
    billingCycle: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
    isActive: boolean;
}

export interface PlanSelectProps {
    onSelect: (plan: MembershipPlan | null) => void;
    selectedPlanId?: string;
    label?: string;
}

/**
 * Searchable membership plan dropdown that mirrors the ProductSelect pattern.
 * Fetches GET /membership-plans?page=1&limit=50 via apiClient and filters
 * client-side by name (Requirement 10.3).
 */
export function PlanSelect({
    onSelect,
    selectedPlanId,
    label = "Select Membership Plan",
}: PlanSelectProps) {
    const [query, setQuery] = useState("");
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [allPlans, setAllPlans] = useState<MembershipPlan[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch all plans once when the dropdown opens
    const fetchPlans = async () => {
        if (allPlans.length > 0) return; // already loaded
        setIsLoading(true);
        try {
            const res = await apiClient<PaginationResponse<MembershipPlan>>(
                "/membership-plans",
                { params: { page: 1, limit: 50 } },
            );
            const list = normalizeListResponse(res).data;
            setAllPlans(list);
            setPlans(list);
        } catch {
            // apiClient already shows an error toast
        } finally {
            setIsLoading(false);
        }
    };

    // Filter client-side whenever the search query changes
    useEffect(() => {
        if (!isOpen) return;
        if (!query.trim()) {
            setPlans(allPlans);
            return;
        }
        const lower = query.toLowerCase();
        setPlans(allPlans.filter((p) => p.name.toLowerCase().includes(lower)));
    }, [query, allPlans, isOpen]);

    // Open → fetch
    useEffect(() => {
        if (isOpen) {
            fetchPlans();
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedPlan = allPlans.find((p) => p.id === selectedPlanId);

    const formatCycle = (cycle: MembershipPlan["billingCycle"]) =>
        cycle.charAt(0) + cycle.slice(1).toLowerCase();

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                {label}
            </label>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-900 cursor-pointer transition-colors bg-white"
            >
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                {selectedPlan ? (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-900 truncate">
                                {selectedPlan.name}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                ${Number(selectedPlan.amount).toFixed(2)} /{" "}
                                {formatCycle(selectedPlan.billingCycle)}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(null);
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 shrink-0 ml-2"
                            aria-label="Clear plan selection"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <span className="text-sm text-gray-400 font-medium">
                        Choose a membership plan…
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 max-h-[300px] overflow-y-auto flex flex-col p-2 animate-in fade-in slide-in-from-top-2">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search by plan name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border-b border-gray-50 focus:outline-none text-sm font-medium mb-2 sticky top-0 bg-white"
                    />

                    {isLoading && (
                        <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                            Loading…
                        </div>
                    )}

                    {!isLoading && plans.length === 0 && (
                        <div className="p-4 text-center text-xs text-gray-400">
                            No plans found
                        </div>
                    )}

                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => {
                                onSelect(plan);
                                setIsOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedPlanId === plan.id
                                    ? "bg-gray-900 text-white"
                                    : "hover:bg-gray-50 text-gray-700"
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedPlanId === plan.id
                                        ? "bg-white/20"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <span className="text-sm font-bold truncate">{plan.name}</span>
                                <span
                                    className={`text-[10px] truncate ${selectedPlanId === plan.id
                                            ? "text-white/60"
                                            : "text-gray-400"
                                        }`}
                                >
                                    ${Number(plan.amount).toFixed(2)} /{" "}
                                    {formatCycle(plan.billingCycle)}
                                </span>
                            </div>
                            {selectedPlanId === plan.id && (
                                <Check className="w-4 h-4 text-white shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

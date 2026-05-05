"use client";

import { useEffect, useState } from "react";
import { Check, Dumbbell } from "lucide-react";
import Link from "next/link";
import {
    apiClient,
    normalizeListResponse,
    PaginationResponse,
} from "@/lib/apiClient";

interface Plan {
    id: string;
    name: string;
    description: string;
    amount: number;
    billingCycle: string;
}

export function Pricing() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchActivePlans() {
            try {
                const res = await apiClient<PaginationResponse<Plan>>(
                    "/membership-plans",
                    {
                        params: { isActive: true, limit: 10 },
                    },
                );
                setPlans(normalizeListResponse(res).data);
            } catch (err) {
                console.error("Failed to fetch plans for home page", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchActivePlans();
    }, []);

    if (plans.length === 0 && !isLoading) return null;

    return (
        <section id="pricing" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-brand font-bold tracking-widest text-sm mb-3">PRICING PLANS</h2>
                    <h3 className="text-4xl lg:text-5xl font-heading font-black text-dark mb-6">
                        CHOOSE YOUR <span className="text-brand">MEMBERSHIP</span>
                    </h3>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                        Unlock your potential with our flexible membership options tailored to your fitness journey and goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-[500px] rounded-[40px] bg-gray-50 animate-pulse" />
                        ))
                    ) : (
                        plans.map((plan, index) => (
                            <div
                                key={plan.id}
                                className={`relative group p-8 lg:p-10 rounded-[40px] border transition-all duration-300 ${index === 1
                                        ? "bg-dark text-white border-dark shadow-2xl scale-105 z-10"
                                        : "bg-white text-dark border-gray-100 hover:border-brand/30 hover:shadow-xl"
                                    }`}
                            >
                                {index === 1 && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand text-white px-6 py-2 rounded-full text-xs font-black tracking-widest">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${index === 1 ? "bg-brand text-white" : "bg-brand/10 text-brand"
                                        }`}>
                                        <Dumbbell className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-heading font-black">{plan.name}</h4>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl lg:text-5xl font-black">${parseFloat(plan.amount.toString()).toFixed(0)}</span>
                                        <span className={`text-sm font-bold ${index === 1 ? "text-gray-400" : "text-gray-500"}`}>
                                            /{plan.billingCycle.toLowerCase().replace('ly', '')}
                                        </span>
                                    </div>
                                    <p className={`mt-4 text-sm font-medium leading-relaxed ${index === 1 ? "text-gray-400" : "text-gray-500"}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-10">
                                    {/* We hardcode some generic features for visual pop, or could use description if it was a list */}
                                    <FeatureItem text="Unlimited Gym Access" active={index >= 0} dark={index === 1} />
                                    <FeatureItem text="Free Fitness Consultation" active={index >= 1} dark={index === 1} />
                                    <FeatureItem text="Locker & Shower Access" active={index >= 0} dark={index === 1} />
                                    <FeatureItem text="Personal Trainer Credit" active={index >= 2} dark={index === 1} />
                                </div>

                                <Link
                                    href="/login"
                                    className={`w-full py-4 rounded-2xl font-black tracking-widest text-sm transition-all flex items-center justify-center uppercase ${index === 1
                                            ? "bg-brand text-white hover:bg-white hover:text-dark"
                                            : "bg-dark text-white hover:bg-brand"
                                        }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

function FeatureItem({ text, active, dark }: { text: string; active: boolean, dark: boolean }) {
    return (
        <div className={`flex items-center gap-3 text-sm font-bold ${active ? "" : "opacity-30"}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${active
                    ? (dark ? "bg-brand/20 text-brand" : "bg-brand text-white")
                    : (dark ? "bg-white/10 text-white/30" : "bg-gray-100 text-gray-400")
                }`}>
                <Check className="w-3 h-3" strokeWidth={4} />
            </div>
            <span className={dark ? (active ? "text-white" : "text-white/30") : (active ? "text-dark" : "text-gray-400")}>
                {text}
            </span>
        </div>
    );
}

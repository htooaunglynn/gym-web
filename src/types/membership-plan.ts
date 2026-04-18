export type BillingCycle = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

export interface MembershipPlan {
    id: string;
    name: string;
    description?: string;
    amount: number | string;
    billingCycle: BillingCycle;
    features: string[];
    isActive: boolean;
    branchId?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

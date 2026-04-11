import { get, post } from "@/lib/api-client";
import { PaginatedResponse } from "@/types/api";
import { Payment, CreatePaymentPayload } from "@/types/entities";

export interface ListPaymentsParams {
    page?: number;
    limit?: number;
    memberId?: string;
    status?: string;
    method?: string;
    from?: string;
    to?: string;
}

export async function getPayments(params?: ListPaymentsParams): Promise<PaginatedResponse<Payment>> {
    return get<PaginatedResponse<Payment>>("/payments", params as Record<string, unknown>);
}

export async function getPaymentById(id: string): Promise<Payment> {
    return get<Payment>(`/payments/${id}`);
}

export async function createPayment(payload: CreatePaymentPayload): Promise<Payment> {
    return post<Payment>("/payments", payload);
}

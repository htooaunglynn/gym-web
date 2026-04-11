"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useApi";
import * as paymentService from "@/services/payments";
import { ListPaymentsParams } from "@/services/payments";
import { AppError, PaginatedResponse } from "@/types/api";
import { CreatePaymentPayload, Payment } from "@/types/entities";

export function usePayments(params?: ListPaymentsParams) {
    return useQuery<PaginatedResponse<Payment>, AppError>({
        queryKey: queryKeys.payments.list(params as Record<string, unknown>),
        queryFn: () => paymentService.getPayments(params),
    });
}

export function usePayment(id: string) {
    return useQuery<Payment, AppError>({
        queryKey: queryKeys.payments.detail(id),
        queryFn: () => paymentService.getPaymentById(id),
        enabled: !!id,
    });
}

export function useCreatePayment() {
    const queryClient = useQueryClient();

    return useMutation<Payment, AppError, CreatePaymentPayload>({
        mutationFn: paymentService.createPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() });
        },
    });
}

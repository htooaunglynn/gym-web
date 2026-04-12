"use client";

import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { AppError, PaginatedResponse } from "@/types/api";

interface CrudQueryKeys {
    all: () => QueryKey;
    list: (params?: Record<string, unknown>) => QueryKey;
    detail: (id: string) => QueryKey;
}

interface CrudService<TEntity, TCreatePayload, TUpdatePayload, TListParams> {
    list: (params?: TListParams) => Promise<PaginatedResponse<TEntity>>;
    detail: (id: string) => Promise<TEntity>;
    create: (payload: TCreatePayload) => Promise<TEntity>;
    update: (id: string, payload: TUpdatePayload) => Promise<TEntity>;
    remove: (id: string) => Promise<void>;
}

interface CreateCrudHooksOptions<TEntity, TCreatePayload, TUpdatePayload, TListParams> {
    queryKeys: CrudQueryKeys;
    service: CrudService<TEntity, TCreatePayload, TUpdatePayload, TListParams>;
}

function toQueryParams<TListParams>(params?: TListParams): Record<string, unknown> | undefined {
    return params as Record<string, unknown> | undefined;
}

export function createCrudHooks<TEntity, TCreatePayload, TUpdatePayload, TListParams>({
    queryKeys,
    service,
}: CreateCrudHooksOptions<TEntity, TCreatePayload, TUpdatePayload, TListParams>) {
    function useList(params?: TListParams) {
        return useQuery<PaginatedResponse<TEntity>, AppError>({
            queryKey: queryKeys.list(toQueryParams(params)),
            queryFn: () => service.list(params),
        });
    }

    function useDetail(id: string) {
        return useQuery<TEntity, AppError>({
            queryKey: queryKeys.detail(id),
            queryFn: () => service.detail(id),
            enabled: !!id,
        });
    }

    function useCreate() {
        const queryClient = useQueryClient();

        return useMutation<TEntity, AppError, TCreatePayload>({
            mutationFn: service.create,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.all() });
            },
        });
    }

    function useUpdate() {
        const queryClient = useQueryClient();

        return useMutation<TEntity, AppError, { id: string; payload: TUpdatePayload }>({
            mutationFn: ({ id, payload }) => service.update(id, payload),
            onSuccess: (_data, variables) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.all() });
                queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
            },
        });
    }

    function useDelete() {
        const queryClient = useQueryClient();

        return useMutation<void, AppError, string>({
            mutationFn: service.remove,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.all() });
            },
        });
    }

    return {
        useList,
        useDetail,
        useCreate,
        useUpdate,
        useDelete,
    };
}

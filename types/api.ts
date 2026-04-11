export interface ApiErrorResponse {
    statusCode: number;
    message: string;
    error?: string;
    details?: Record<string, unknown>;
}

export interface AppError {
    code: string;
    userMessage: string;
    field?: string;
    isDuplicate?: boolean;
    isUnauthorized?: boolean;
    isPermissionDenied?: boolean;
    isNotFound?: boolean;
    isValidation?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

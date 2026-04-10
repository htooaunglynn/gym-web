import axios, { type AxiosInstance, type AxiosError } from 'axios'

// API Error response type
export interface ApiErrorResponse {
    statusCode: number
    message: string | string[]
    error?: string
}

// Normalized error for UX consumption
export interface AppError {
    code: number
    message: string
    userMessage: string
    field?: string
    isDuplicate?: boolean
    isValidation?: boolean
    isUnauthorized?: boolean
    isPermissionDenied?: boolean
}

export class ApiClient {
    private client: AxiosInstance
    private token: string | null = null

    constructor(baseURL: string = 'http://localhost:3000') {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
        })

        // Request interceptor to add auth token
        this.client.interceptors.request.use((config) => {
            const token = this.getToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })

        // Response error interceptor for normalization
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                throw this.normalizeError(error)
            }
        )
    }

    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('gymhub_token')
        }
        return this.token
    }

    setToken(token: string | null): void {
        this.token = token
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('gymhub_token', token)
            } else {
                localStorage.removeItem('gymhub_token')
            }
        }
    }

    private normalizeError(error: AxiosError): AppError {
        const data = error.response?.data as ApiErrorResponse | undefined
        const status = error.response?.status || 0

        // Duplicate conflict (409)
        if (status === 409) {
            return {
                code: 409,
                message: data?.message ? String(data.message) : 'Resource already exists',
                userMessage: 'This email or phone is already registered',
                isDuplicate: true,
            }
        }

        // Unauthorized (401)
        if (status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('gymhub_token')
            }
            return {
                code: 401,
                message: 'Unauthorized',
                userMessage: 'Your session has expired. Please log in again.',
                isUnauthorized: true,
            }
        }

        // Permission denied (403)
        if (status === 403) {
            return {
                code: 403,
                message: 'Forbidden',
                userMessage: 'You do not have permission to perform this action.',
                isPermissionDenied: true,
            }
        }

        // Validation error (400)
        if (status === 400) {
            const message = Array.isArray(data?.message)
                ? data.message.join(', ')
                : data?.message || 'Invalid request'
            return {
                code: 400,
                message,
                userMessage: message,
                isValidation: true,
            }
        }

        // Not found (404)
        if (status === 404) {
            return {
                code: 404,
                message: 'Not found',
                userMessage: 'The requested resource was not found.',
            }
        }

        // Server error (5xx)
        if (status >= 500) {
            return {
                code: status,
                message: 'Server error',
                userMessage: 'Something went wrong on the server. Please try again later.',
            }
        }

        // Network error
        if (!error.response) {
            return {
                code: 0,
                message: 'Network error',
                userMessage: 'Could not connect to the server. Check your internet connection.',
            }
        }

        // Unknown error
        return {
            code: status,
            message: error.message || 'Unknown error',
            userMessage: 'An unexpected error occurred. Please try again.',
        }
    }

    // Generic request methods
    async get<T>(url: string, config?: any): Promise<T> {
        const response = await this.client.get<T>(url, config)
        return response.data
    }

    async post<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.post<T>(url, data, config)
        return response.data
    }

    async patch<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.patch<T>(url, data, config)
        return response.data
    }

    async delete<T>(url: string, config?: any): Promise<T> {
        const response = await this.client.delete<T>(url, config)
        return response.data
    }
}

// Singleton instance
export const apiClient = new ApiClient()

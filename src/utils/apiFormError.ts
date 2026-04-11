import type { AppError } from '@/services'

export type FormFieldErrors<TField extends string> = Partial<Record<TField, string>>

interface MapFormErrorOptions<TField extends string> {
    fallbackMessage: string
    fieldMatchers: Record<TField, RegExp>
}

export function mapAppErrorToForm<TField extends string>(
    error: unknown,
    options: MapFormErrorOptions<TField>
): { message: string; fieldErrors: FormFieldErrors<TField> } {
    if (!isAppError(error)) {
        return { message: options.fallbackMessage, fieldErrors: {} }
    }

    const fieldErrors: FormFieldErrors<TField> = {}
    const normalizedMessage = error.message.toLowerCase()

    for (const [field, matcher] of Object.entries(options.fieldMatchers) as Array<[TField, RegExp]>) {
        if (matcher.test(normalizedMessage)) {
            fieldErrors[field] = error.userMessage
        }
    }

    return {
        message: error.userMessage || options.fallbackMessage,
        fieldErrors,
    }
}

function isAppError(error: unknown): error is AppError {
    return typeof error === 'object' && error !== null && 'userMessage' in error
}

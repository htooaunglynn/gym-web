import React from "react";
import { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Input({
    label,
    error,
    helperText,
    className = "",
    ...props
}: InputProps) {
    const generatedId = useId();
    const inputId = props.id ?? generatedId;
    const describedBy = error
        ? `${inputId}-error`
        : helperText
            ? `${inputId}-helper`
            : undefined;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-label-md font-semibold text-on-surface mb-2">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                aria-invalid={!!error}
                aria-describedby={describedBy}
                className={`
          w-full px-4 py-2 rounded-md
          bg-surface-container-highest/40
          border border-outline-variant/30
          text-on-surface placeholder-on-surface/50
          focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50
          transition-default
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-error" : ""}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p id={`${inputId}-error`} className="text-error text-label-md mt-1" role="alert" aria-live="polite">
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p id={`${inputId}-helper`} className="text-on-surface-variant text-label-md mt-1">
                    {helperText}
                </p>
            )}
        </div>
    );
}

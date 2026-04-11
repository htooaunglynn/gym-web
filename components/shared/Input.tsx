import React from "react";

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
    return (
        <div className="w-full">
            {label && (
                <label className="block text-label-md font-semibold text-on-surface mb-2">
                    {label}
                </label>
            )}
            <input
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
                <p className="text-error text-label-md mt-1">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-on-surface-variant text-label-md mt-1">{helperText}</p>
            )}
        </div>
    );
}

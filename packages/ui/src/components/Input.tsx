"use client";

import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full px-3 py-2 rounded-xl border bg-white text-gray-900 placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-[#E84C4C]/30 focus:border-[#E84C4C]",
          "transition-colors text-sm",
          error ? "border-red-400" : "border-gray-200",
          className,
        ]
          .join(" ")
          .trim()}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
}

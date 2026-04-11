"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
    const { setTheme, isDark } = useTheme();

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="
        p-2 rounded-md
        bg-surface-container hover:bg-surface-container-high
        text-on-surface transition-default
        focus-ring
      "
            aria-label="Toggle theme"
        >
            {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414L13.536 9.172a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 0zM9 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1zm6.364 1.636a1 1 0 011.414 0l1 1a1 1 0 11-1.414 1.414l-1-1a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </button>
    );
}

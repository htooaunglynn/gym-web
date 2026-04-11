import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Cyber-Athletic Protocol (Dark Mode)
                "cyber-primary": "#d0ff3c", // Voltage Green
                "cyber-secondary": "#6bfe9c", // Electric Mint
                "cyber-surface": "#0e0e0e",
                "cyber-surface-low": "#1a1a1a",
                "cyber-surface-lowest": "#000000",
                "cyber-surface-high": "#2a2a2a",
                "cyber-surface-highest": "#373737",

                // Clinical Athlete (Light Mode)
                "clinical-primary": "#0052d0", // Athletic Blue
                "clinical-primary-container": "#799dff",
                "clinical-surface": "#f5f6f7",
                "clinical-surface-low": "#eff1f2",
                "clinical-surface-lowest": "#ffffff",
                "clinical-surface-high": "#e8ebee",
                "clinical-surface-highest": "#dadddf",
            },
            fontSize: {
                "display-lg": ["3.5rem", { lineHeight: "1.1", fontWeight: "700" }],
                "headline-sm": ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
                "title-md": ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
                "body-md": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
                "label-md": ["0.75rem", { lineHeight: "1.3", fontWeight: "600" }],
            },
            spacing: {
                xs: "4px",
                sm: "8px",
                md: "12px",
                lg: "16px",
                xl: "24px",
                "2xl": "32px",
                "3xl": "48px",
            },
            borderRadius: {
                xs: "4px",
                sm: "8px",
                md: "12px",
                lg: "16px",
                xl: "20px",
            },
            boxShadow: {
                ambient: "0 8px 40px rgba(212, 212, 212, 0.08)",
                "ambient-dark": "0 8px 40px rgba(0, 0, 0, 0.4)",
            },
            backdropBlur: {
                glass: "20px",
            },
        },
    },
    plugins: [],
};

export default config;

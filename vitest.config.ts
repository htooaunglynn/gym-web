import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        exclude: ["e2e/**", "node_modules/**"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            exclude: [
                "node_modules/**",
                "e2e/**",
                "next.config.ts",
                "tailwind.config.ts",
                "postcss.config.mjs",
                "vitest.setup.ts",
                "vitest.config.ts",
                "playwright.config.ts",
                "**/*.d.ts",
            ],
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "."),
        },
    },
});

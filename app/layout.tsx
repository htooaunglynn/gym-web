import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClientProvider } from "@/context/QueryClientProvider";
import { ToastProvider } from "@/context/ToastContext";
import { ToastContainer } from "@/components/shared/ToastContainer";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "GymHub - Gym Management System",
    description: "Professional gym management software",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider>
                    <AuthProvider>
                        <QueryClientProvider>
                            <ToastProvider>
                                {children}
                                <ToastContainer />
                            </ToastProvider>
                        </QueryClientProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

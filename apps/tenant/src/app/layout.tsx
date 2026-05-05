import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/shared/Toast";

export const metadata: Metadata = {
    title: "FIYKIT | Your Fitness Your Victory",
    description: "Gym management and fitness classes.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className="antialiased min-h-screen flex flex-col font-sans"
            >
                <ToastProvider>
                    <AuthProvider>{children}</AuthProvider>
                    <ToastContainer />
                </ToastProvider>
            </body>
        </html>
    );
}

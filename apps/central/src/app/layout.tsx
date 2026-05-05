import type { Metadata } from "next";
import "./globals.css";
import { CentralAuthProvider } from "@/contexts/CentralAuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata: Metadata = {
  title: {
    default: "Gym SaaS — Super Admin",
    template: "%s | Gym SaaS Central",
  },
  description: "Gym SaaS super-admin control panel",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#0f0f13] text-white">
        <CentralAuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </CentralAuthProvider>
      </body>
    </html>
  );
}

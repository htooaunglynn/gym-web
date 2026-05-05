"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side auth guard hook.
 * Redirects to /login if no valid accessToken is found in localStorage.
 * Should be used in dashboard layout or page components.
 */
export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    // Validate the token is a well-formed JWT (3 parts) and not expired
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        localStorage.removeItem("accessToken");
        router.replace("/login");
        return;
      }

      // Decode payload to check expiry
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "=",
      );
      const payload = JSON.parse(atob(padded)) as { exp?: number };

      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
          // Token expired
          localStorage.removeItem("accessToken");
          router.replace("/login");
        }
      }
    } catch {
      // Malformed token
      localStorage.removeItem("accessToken");
      router.replace("/login");
    }
  }, [router]);
}

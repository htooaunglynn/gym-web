import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (formerly middleware) for server-side route protection.
 * Checks for accessToken in cookies and redirects to /login if missing.
 *
 * Note: This is a server-side check. The client-side useAuthGuard hook
 * provides additional protection for client-side navigation.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a dashboard route
  if (pathname.startsWith("/dashboard")) {
    // Check for accessToken in cookies (if set) or localStorage (client-side only)
    // Since we're using localStorage for token storage, the proxy can't directly
    // access it. We rely on the client-side useAuthGuard for protection.
    // However, we can check for a cookie if we decide to also store it there.

    const token = request.cookies.get("accessToken")?.value;

    // If no token in cookies, allow the request to proceed.
    // The client-side useAuthGuard will handle the redirect.
    // This is because we're using localStorage for token storage.
    // If you want full server-side protection, you should also store the token in cookies.

    if (!token) {
      // For now, we'll let the client-side guard handle this
      // since the token is in localStorage, not cookies.
      // If you want server-side protection, you need to also set the token as a cookie.
      return NextResponse.next();
    }

    // If token exists in cookies, validate it (basic check)
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        // Invalid JWT format
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        return response;
      }

      // Decode payload to check expiry
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "=",
      );
      const payload = JSON.parse(Buffer.from(padded, "base64").toString()) as {
        exp?: number;
      };

      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
          // Token expired
          const response = NextResponse.redirect(
            new URL("/login", request.url),
          );
          response.cookies.delete("accessToken");
          return response;
        }
      }
    } catch {
      // Malformed token
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
  ],
};

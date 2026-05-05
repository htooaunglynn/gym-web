import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0];

  const isDev = hostname === "localhost" || hostname === "127.0.0.1";

  // In prod: verify hostname === 'central.gym-saas.app'
  if (!isDev && hostname !== "central.gym-saas.app") {
    // If not central domain -> redirect to tenant app
    const tenantUrl = new URL(pathname, `https://${hostname}`);
    return NextResponse.redirect(tenantUrl);
  }

  // Allow public paths through
  const PUBLIC_PATHS = ["/login", "/favicon.ico", "/_next", "/api/health"];
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    const response = NextResponse.next();
    response.headers.set("x-portal", "central");
    return response;
  }

  // Auth check: require central_refresh_token cookie
  const hasToken = request.cookies.has("central_refresh_token");

  if (!hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("x-portal", "central");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

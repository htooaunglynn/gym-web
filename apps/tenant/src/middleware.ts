import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0]; // strip port in dev

  // Reject if somehow on central domain
  if (hostname === "central.gym-saas.app") {
    const centralUrl = new URL(request.nextUrl.pathname, "https://central.gym-saas.app");
    return NextResponse.redirect(centralUrl);
  }

  // Extract slug from {slug}.gym-saas.app
  let slug: string | null = null;
  const isProd = hostname.endsWith(".gym-saas.app");

  if (isProd) {
    slug = hostname.replace(".gym-saas.app", "");
  } else {
    // Development: use NEXT_PUBLIC_DEV_TENANT_SLUG
    slug = process.env.NEXT_PUBLIC_DEV_TENANT_SLUG ?? null;
  }

  if (!slug) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  // Auth check: require access token cookie on protected routes
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  const hasToken = request.cookies.has("tenant_refresh_token");

  if (!isAuthRoute && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Pass slug via header to server components
  const response = NextResponse.next();
  response.headers.set("x-tenant-slug", slug);
  response.headers.set("x-hostname", hostname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/).*)"],
};

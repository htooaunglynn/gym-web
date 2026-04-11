import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("accessToken")?.value ||
        request.headers.get("authorization")?.replace("Bearer ", "");

    // If trying to access auth routes and already authenticated, redirect to dashboard
    if (authRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If trying to access protected routes without token, redirect to login
    if (!publicRoutes.includes(pathname) && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};

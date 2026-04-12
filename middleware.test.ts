import { describe, it, expect } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/middleware";

function makeRequest(
    pathname: string,
    opts: { cookie?: string; authHeader?: string } = {}
): NextRequest {
    const url = `http://localhost:3000${pathname}`;
    const headers = new Headers();
    if (opts.cookie) headers.set("cookie", `accessToken=${opts.cookie}`);
    if (opts.authHeader) headers.set("authorization", `Bearer ${opts.authHeader}`);
    return new NextRequest(url, { headers });
}

describe("middleware — public routes", () => {
    it("allows / without a token", () => {
        const req = makeRequest("/");
        const res = middleware(req);
        expect(res).toBeInstanceOf(NextResponse);
        // NextResponse.next() does not have a redirect location
        expect((res as Response).headers.get("location")).toBeNull();
    });
});

describe("middleware — auth routes with existing token", () => {
    it("redirects /login → /dashboard when cookie token exists", () => {
        const req = makeRequest("/login", { cookie: "valid-token" });
        const res = middleware(req);
        expect((res as Response).headers.get("location")).toContain("/dashboard");
    });

    it("redirects /register → /dashboard when cookie token exists", () => {
        const req = makeRequest("/register", { cookie: "valid-token" });
        const res = middleware(req);
        expect((res as Response).headers.get("location")).toContain("/dashboard");
    });

    it("redirects /login → /dashboard when Authorization header token exists", () => {
        const req = makeRequest("/login", { authHeader: "valid-token" });
        const res = middleware(req);
        expect((res as Response).headers.get("location")).toContain("/dashboard");
    });
});

describe("middleware — protected routes without token", () => {
    it("redirects /dashboard → /login when no token", () => {
        const req = makeRequest("/dashboard");
        const res = middleware(req);
        expect((res as Response).headers.get("location")).toContain("/login");
    });

    it("redirects /members → /login when no token", () => {
        const req = makeRequest("/members");
        const res = middleware(req);
        expect((res as Response).headers.get("location")).toContain("/login");
    });

    it("redirects /attendance → /login when no token", () => {
        const req = makeRequest("/attendance");
        const res = middleware(req);
        expect((res as Response).headers.get("location")).toContain("/login");
    });
});

describe("middleware — protected routes with valid token", () => {
    it("allows /dashboard access when cookie token present", () => {
        const req = makeRequest("/dashboard", { cookie: "valid-token" });
        const res = middleware(req);
        expect((res as Response).headers.get("location")).toBeNull();
    });

    it("allows /members access when Authorization header present", () => {
        const req = makeRequest("/members", { authHeader: "valid-token" });
        const res = middleware(req);
        expect((res as Response).headers.get("location")).toBeNull();
    });
});

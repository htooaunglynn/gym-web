import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { middleware } from "./middleware";
import { NextRequest, NextResponse } from "next/server";

vi.mock("next/server", () => {
  return {
    NextResponse: {
      next: vi.fn(() => ({
        headers: new Headers(),
      })),
      redirect: vi.fn((url) => ({ url: url.toString(), type: "redirect" })),
      rewrite: vi.fn((url) => ({ url: url.toString(), type: "rewrite" })),
    },
  };
});

function createMockRequest(urlStr: string, host: string, cookies: Record<string, string> = {}) {
  const url = new URL(urlStr);
  return {
    nextUrl: {
      pathname: url.pathname,
      clone: () => new URL(urlStr),
    },
    url: urlStr,
    headers: {
      get: (key: string) => (key.toLowerCase() === "host" ? host : null),
    },
    cookies: {
      has: (key: string) => key in cookies,
    },
  } as unknown as NextRequest;
}

describe("Tenant Middleware", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("prod domain alpha.gym-saas.app -> sets x-tenant-slug to alpha", () => {
    const req = createMockRequest("https://alpha.gym-saas.app/dashboard", "alpha.gym-saas.app", { tenant_refresh_token: "token" });
    const res = middleware(req) as any;
    expect(res.headers.get("x-tenant-slug")).toBe("alpha");
    expect(res.headers.get("x-hostname")).toBe("alpha.gym-saas.app");
  });

  it("no token on protected route -> redirect to /login with ?redirect=", () => {
    const req = createMockRequest("https://alpha.gym-saas.app/dashboard", "alpha.gym-saas.app");
    const res = middleware(req) as any;
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(res.type).toBe("redirect");
    expect(res.url).toContain("/login?redirect=%2Fdashboard");
  });

  it("central domain -> redirect to central app", () => {
    const req = createMockRequest("https://central.gym-saas.app/dashboard", "central.gym-saas.app");
    const res = middleware(req) as any;
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(res.url).toBe("https://central.gym-saas.app/dashboard");
  });

  it("no slug in dev without env var -> rewrite to /not-found", () => {
    delete process.env.NEXT_PUBLIC_DEV_TENANT_SLUG;
    const req = createMockRequest("http://localhost:3000/dashboard", "localhost:3000");
    const res = middleware(req) as any;
    expect(NextResponse.rewrite).toHaveBeenCalled();
    expect(res.type).toBe("rewrite");
    expect(res.url).toContain("/not-found");
  });
});

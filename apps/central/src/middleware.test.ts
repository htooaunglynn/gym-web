import { describe, it, expect, vi, beforeEach } from "vitest";
import { middleware } from "./middleware";
import { NextRequest, NextResponse } from "next/server";

vi.mock("next/server", () => {
  return {
    NextResponse: {
      next: vi.fn(() => ({
        headers: new Headers(),
      })),
      redirect: vi.fn((url) => ({ url: url.toString(), type: "redirect" })),
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

describe("Central Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("non-central domain -> redirect to tenant app", () => {
    const req = createMockRequest("https://alpha.gym-saas.app/dashboard", "alpha.gym-saas.app");
    const res = middleware(req) as any;
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(res.type).toBe("redirect");
    expect(res.url).toBe("https://alpha.gym-saas.app/dashboard");
  });

  it("central domain with token -> proceeds and sets portal header", () => {
    const req = createMockRequest("https://central.gym-saas.app/dashboard", "central.gym-saas.app", { central_refresh_token: "token" });
    const res = middleware(req) as any;
    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.headers.get("x-portal")).toBe("central");
  });

  it("central domain without token -> redirects to login", () => {
    const req = createMockRequest("https://central.gym-saas.app/dashboard", "central.gym-saas.app");
    const res = middleware(req) as any;
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(res.url).toContain("/login?from=%2Fdashboard");
  });
});

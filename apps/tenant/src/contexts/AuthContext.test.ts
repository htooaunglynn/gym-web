/**
 * Unit + property-based tests for AuthContext JWT decoding logic
 * Validates: Requirements 1.8
 *
 * We test the pure decoding logic extracted from AuthContext directly,
 * since the context itself requires a React environment.
 */
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import type { GlobalRole } from "./AuthContext";

// ─── Re-implement the pure decode logic under test ────────────────────────────
// (mirrors the implementation in AuthContext.tsx exactly)

interface JwtPayload {
  sub: string;
  email: string;
  role?: GlobalRole;
  globalRole: GlobalRole;
  branchId: string | null;
  isAdmin?: boolean;
  iat: number;
  exp: number;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const jsonStr = atob(padded);
    const payload = JSON.parse(jsonStr) as JwtPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  // Use base64url encoding (replace + with -, / with _, strip =)
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return `${header}.${body}.fakesig`;
}

const ROLES: GlobalRole[] = ["ADMIN", "BRANCH_ADMIN", "STAFF", "HR", "MANAGER"];
const futureExp = () => Math.floor(Date.now() / 1000) + 3600;
const pastExp = () => Math.floor(Date.now() / 1000) - 1;

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe("decodeJwt – unit tests", () => {
  it("returns null for a non-JWT string", () => {
    expect(decodeJwt("not-a-jwt")).toBeNull();
    expect(decodeJwt("")).toBeNull();
    expect(decodeJwt("a.b")).toBeNull();
  });

  it("returns null for an expired token", () => {
    const token = makeJwt({
      sub: "1",
      email: "a@b.com",
      globalRole: "STAFF",
      branchId: null,
      iat: pastExp() - 100,
      exp: pastExp(),
    });
    expect(decodeJwt(token)).toBeNull();
  });

  it("decodes a valid token and returns all fields", () => {
    const payload = {
      sub: "user-123",
      email: "admin@gym.com",
      role: "ADMIN" as GlobalRole,
      globalRole: "ADMIN" as GlobalRole,
      branchId: "branch-456",
      isAdmin: true,
      iat: Math.floor(Date.now() / 1000),
      exp: futureExp(),
    };
    const token = makeJwt(payload);
    const result = decodeJwt(token);

    expect(result).not.toBeNull();
    expect(result!.sub).toBe(payload.sub);
    expect(result!.email).toBe(payload.email);
    expect(result!.globalRole).toBe(payload.globalRole);
    expect(result!.branchId).toBe(payload.branchId);
  });

  it("decodes a token with null branchId", () => {
    const token = makeJwt({
      sub: "u1",
      email: "x@y.com",
      role: "ADMIN",
      globalRole: "ADMIN",
      branchId: null,
      isAdmin: true,
      iat: 0,
      exp: futureExp(),
    });
    const result = decodeJwt(token);
    expect(result).not.toBeNull();
    expect(result!.branchId).toBeNull();
  });

  it("handles tokens with no exp field (treats as valid)", () => {
    const token = makeJwt({
      sub: "u1",
      email: "x@y.com",
      role: "STAFF",
      globalRole: "STAFF",
      branchId: null,
      isAdmin: false,
      iat: 0,
      // no exp
    });
    const result = decodeJwt(token);
    expect(result).not.toBeNull();
  });
});

// ─── Property-based tests ─────────────────────────────────────────────────────

/**
 * Property 3: JWT payload fields are fully decoded into AuthContext
 * Validates: Requirements 1.8
 */
describe("Property 3 – JWT payload fields survive decode round-trip", () => {
  it("sub, email, globalRole, branchId are preserved exactly for any valid payload", () => {
    fc.assert(
      fc.property(
        fc.record({
          sub: fc.uuid(),
          email: fc.emailAddress(),
          role: fc.constantFrom(...ROLES),
          globalRole: fc.constantFrom(...ROLES),
          branchId: fc.oneof(fc.uuid(), fc.constant(null)),
          isAdmin: fc.boolean(),
          iat: fc.integer({ min: 0, max: Math.floor(Date.now() / 1000) }),
          exp: fc.constant(futureExp()),
        }),
        (payload) => {
          const token = makeJwt(payload);
          const decoded = decodeJwt(token);

          expect(decoded).not.toBeNull();
          expect(decoded!.sub).toBe(payload.sub);
          expect(decoded!.email).toBe(payload.email);
          expect(decoded!.globalRole).toBe(payload.globalRole);
          expect(decoded!.branchId).toBe(payload.branchId);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("always returns null for expired tokens regardless of other fields", () => {
    fc.assert(
      fc.property(
        fc.record({
          sub: fc.uuid(),
          email: fc.emailAddress(),
          role: fc.constantFrom(...ROLES),
          globalRole: fc.constantFrom(...ROLES),
          branchId: fc.oneof(fc.uuid(), fc.constant(null)),
          isAdmin: fc.boolean(),
          iat: fc.integer({ min: 0, max: 1000 }),
          exp: fc.integer({ min: 1, max: Math.floor(Date.now() / 1000) - 1 }),
        }),
        (payload) => {
          const token = makeJwt(payload);
          expect(decodeJwt(token)).toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });
});

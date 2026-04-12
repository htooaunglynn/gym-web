import { Member } from "@/types/entities";
import { PaginatedResponse } from "@/types/api";
import { AuthResponse, User } from "@/types/auth";

let _id = 1;
const nextId = () => `test-id-${_id++}`;

// ─── Member ───────────────────────────────────────────────────────────────────
export function buildMember(overrides: Partial<Member> = {}): Member {
    return {
        id: nextId(),
        email: "alice@example.com",
        firstName: "Alice",
        lastName: "Smith",
        phone: "+15550001234",
        trainerId: null,
        trainer: null,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        ...overrides,
    };
}

export function buildMemberList(
    count = 3,
    overrides: Partial<Member> = {}
): PaginatedResponse<Member> {
    const data = Array.from({ length: count }, (_, i) =>
        buildMember({ id: `member-${i + 1}`, email: `member${i + 1}@example.com`, ...overrides })
    );
    return {
        data,
        meta: { total: count, limit: 10, offset: 0, hasMore: false },
    };
}

// ─── User ─────────────────────────────────────────────────────────────────────
export function buildUser(overrides: Partial<User> = {}): User {
    return {
        id: nextId(),
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        phone: "+15550009999",
        role: "ADMIN",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        ...overrides,
    };
}

// ─── Auth Response ────────────────────────────────────────────────────────────
export function buildAuthResponse(overrides: Partial<AuthResponse> = {}): AuthResponse {
    return {
        accessToken: "mock-access-token",
        user: buildUser(),
        ...overrides,
    };
}

import { Equipment, Member, Trainer } from "@/types/entities";
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

// ─── Trainer ─────────────────────────────────────────────────────────────────
export function buildTrainer(overrides: Partial<Trainer> = {}): Trainer {
    return {
        id: nextId(),
        email: "trainer@example.com",
        firstName: "Taylor",
        lastName: "Coach",
        phone: "+15550004567",
        members: [],
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        ...overrides,
    };
}

export function buildTrainerList(
    count = 3,
    overrides: Partial<Trainer> = {}
): PaginatedResponse<Trainer> {
    const data = Array.from({ length: count }, (_, i) =>
        buildTrainer({ id: `trainer-${i + 1}`, email: `trainer${i + 1}@example.com`, ...overrides })
    );

    return {
        data,
        meta: { total: count, limit: 10, offset: 0, hasMore: false },
    };
}

// ─── Equipment ───────────────────────────────────────────────────────────────
export function buildEquipment(overrides: Partial<Equipment> = {}): Equipment {
    return {
        id: nextId(),
        name: "Treadmill Pro",
        category: "Cardio",
        quantity: 4,
        status: "OPERATIONAL",
        notes: "Floor A",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        ...overrides,
    };
}

export function buildEquipmentList(
    count = 3,
    overrides: Partial<Equipment> = {}
): PaginatedResponse<Equipment> {
    const data = Array.from({ length: count }, (_, i) =>
        buildEquipment({ id: `equipment-${i + 1}`, name: `Equipment ${i + 1}`, ...overrides })
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

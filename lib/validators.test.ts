import { describe, it, expect } from "vitest";
import {
    loginSchema,
    registerMemberSchema,
    createMemberSchema,
    updateMemberSchema,
    createTrainerSchema,
    updateTrainerSchema,
    createEquipmentSchema,
    updateEquipmentSchema,
} from "@/lib/validators";

// ─── loginSchema ──────────────────────────────────────────────────────────────
describe("loginSchema", () => {
    it("accepts valid credentials", () => {
        const result = loginSchema.safeParse({ email: "user@example.com", password: "secret" });
        expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
        const result = loginSchema.safeParse({ email: "not-an-email", password: "secret" });
        expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
        const result = loginSchema.safeParse({ email: "user@example.com", password: "" });
        expect(result.success).toBe(false);
    });

    it("accepts optional accountType", () => {
        const result = loginSchema.safeParse({
            email: "user@example.com",
            password: "secret",
            accountType: "MEMBER",
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid accountType", () => {
        const result = loginSchema.safeParse({
            email: "user@example.com",
            password: "secret",
            accountType: "GUEST",
        });
        expect(result.success).toBe(false);
    });
});

// ─── registerMemberSchema ─────────────────────────────────────────────────────
describe("registerMemberSchema", () => {
    const valid = {
        email: "alice@example.com",
        firstName: "Alice",
        lastName: "Smith",
        password: "Password1",
    };

    it("accepts valid payload", () => {
        expect(registerMemberSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects password shorter than 8 chars", () => {
        const result = registerMemberSchema.safeParse({ ...valid, password: "Pass1" });
        expect(result.success).toBe(false);
    });

    it("rejects password without uppercase", () => {
        const result = registerMemberSchema.safeParse({ ...valid, password: "password1" });
        expect(result.success).toBe(false);
    });

    it("rejects password without digit", () => {
        const result = registerMemberSchema.safeParse({ ...valid, password: "Password" });
        expect(result.success).toBe(false);
    });

    it("accepts valid E.164 phone", () => {
        const result = registerMemberSchema.safeParse({ ...valid, phone: "+15550001234" });
        expect(result.success).toBe(true);
    });

    it("accepts formatted phone number", () => {
        const result = registerMemberSchema.safeParse({ ...valid, phone: "(555) 000-1234" });
        expect(result.success).toBe(true);
    });

    it("rejects invalid phone format", () => {
        const result = registerMemberSchema.safeParse({ ...valid, phone: "abc-def" });
        expect(result.success).toBe(false);
    });

    it("accepts missing phone (optional)", () => {
        const result = registerMemberSchema.safeParse({ ...valid });
        expect(result.success).toBe(true);
    });
});

// ─── createMemberSchema ───────────────────────────────────────────────────────
describe("createMemberSchema", () => {
    const valid = {
        email: "bob@example.com",
        firstName: "Bob",
        lastName: "Jones",
        password: "Secure1!",
    };

    it("accepts valid payload without trainerId", () => {
        expect(createMemberSchema.safeParse(valid).success).toBe(true);
    });

    it("accepts optional trainerId", () => {
        const result = createMemberSchema.safeParse({ ...valid, trainerId: "trainer-123" });
        expect(result.success).toBe(true);
    });

    it("rejects missing first name", () => {
        const result = createMemberSchema.safeParse({ ...valid, firstName: "" });
        expect(result.success).toBe(false);
    });
});

// ─── updateMemberSchema ───────────────────────────────────────────────────────
describe("updateMemberSchema", () => {
    it("accepts empty object (all fields optional)", () => {
        expect(updateMemberSchema.safeParse({}).success).toBe(true);
    });

    it("accepts partial update", () => {
        const result = updateMemberSchema.safeParse({ firstName: "Alice" });
        expect(result.success).toBe(true);
    });

    it("accepts null trainerId", () => {
        const result = updateMemberSchema.safeParse({ trainerId: null });
        expect(result.success).toBe(true);
    });

    it("rejects invalid email when provided", () => {
        const result = updateMemberSchema.safeParse({ email: "bad-email" });
        expect(result.success).toBe(false);
    });
});

// ─── createTrainerSchema ──────────────────────────────────────────────────────
describe("createTrainerSchema", () => {
    const valid = {
        email: "trainer@gym.com",
        firstName: "Sam",
        lastName: "Trainer",
    };

    it("accepts valid payload", () => {
        expect(createTrainerSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects missing last name", () => {
        const result = createTrainerSchema.safeParse({ ...valid, lastName: "" });
        expect(result.success).toBe(false);
    });
});

// ─── updateTrainerSchema ──────────────────────────────────────────────────────
describe("updateTrainerSchema", () => {
    it("accepts empty object (all fields optional)", () => {
        expect(updateTrainerSchema.safeParse({}).success).toBe(true);
    });

    it("rejects invalid email when provided", () => {
        const result = updateTrainerSchema.safeParse({ email: "nope" });
        expect(result.success).toBe(false);
    });
});

// ─── createEquipmentSchema ────────────────────────────────────────────────────
describe("createEquipmentSchema", () => {
    const valid = { name: "Treadmill", category: "Cardio", quantity: 5 };

    it("accepts valid payload", () => {
        expect(createEquipmentSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects negative quantity", () => {
        const result = createEquipmentSchema.safeParse({ ...valid, quantity: -1 });
        expect(result.success).toBe(false);
    });

    it("rejects float quantity", () => {
        const result = createEquipmentSchema.safeParse({ ...valid, quantity: 1.5 });
        expect(result.success).toBe(false);
    });

    it("accepts quantity of zero", () => {
        const result = createEquipmentSchema.safeParse({ ...valid, quantity: 0 });
        expect(result.success).toBe(true);
    });

    it("accepts valid status", () => {
        const result = createEquipmentSchema.safeParse({ ...valid, status: "OPERATIONAL" });
        expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
        const result = createEquipmentSchema.safeParse({ ...valid, status: "BROKEN" });
        expect(result.success).toBe(false);
    });
});

// ─── updateEquipmentSchema ────────────────────────────────────────────────────
describe("updateEquipmentSchema", () => {
    it("accepts empty object (all fields optional)", () => {
        expect(updateEquipmentSchema.safeParse({}).success).toBe(true);
    });

    it("accepts valid status update", () => {
        const result = updateEquipmentSchema.safeParse({ status: "RETIRED" });
        expect(result.success).toBe(true);
    });
});

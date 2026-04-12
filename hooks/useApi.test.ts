import { describe, it, expect } from "vitest";
import { queryKeys } from "@/hooks/useApi";

describe("queryKeys", () => {
    describe("auth", () => {
        it("me returns correct key", () => {
            expect(queryKeys.auth.me()).toEqual(["auth", "me"]);
        });
    });

    describe("members", () => {
        it("all returns base key", () => {
            expect(queryKeys.members.all()).toEqual(["members"]);
        });

        it("list with no params returns key with undefined", () => {
            expect(queryKeys.members.list()).toEqual(["members", "list", undefined]);
        });

        it("list with params includes params in key", () => {
            const params = { page: 1, search: "alice" };
            expect(queryKeys.members.list(params)).toEqual(["members", "list", params]);
        });

        it("detail includes the id in key", () => {
            expect(queryKeys.members.detail("abc-123")).toEqual(["members", "detail", "abc-123"]);
        });
    });

    describe("trainers", () => {
        it("dropdown returns distinct key", () => {
            expect(queryKeys.trainers.dropdown()).toEqual(["trainers", "dropdown"]);
        });

        it("all returns base key", () => {
            expect(queryKeys.trainers.all()).toEqual(["trainers"]);
        });

        it("list and detail return stable keys", () => {
            expect(queryKeys.trainers.list({ search: "sam" })).toEqual([
                "trainers",
                "list",
                { search: "sam" },
            ]);
            expect(queryKeys.trainers.detail("trainer-1")).toEqual([
                "trainers",
                "detail",
                "trainer-1",
            ]);
        });
    });

    describe("equipment", () => {
        it("all returns base key", () => {
            expect(queryKeys.equipment.all()).toEqual(["equipment"]);
        });

        it("list includes params", () => {
            expect(queryKeys.equipment.list({ status: "ACTIVE" })).toEqual([
                "equipment",
                "list",
                { status: "ACTIVE" },
            ]);
        });

        it("detail includes id", () => {
            expect(queryKeys.equipment.detail("eq-1")).toEqual(["equipment", "detail", "eq-1"]);
        });
    });

    describe("attendance", () => {
        it("all, list, and detail return stable keys", () => {
            expect(queryKeys.attendance.all()).toEqual(["attendance"]);
            expect(queryKeys.attendance.list({ memberId: "m-1" })).toEqual([
                "attendance",
                "list",
                { memberId: "m-1" },
            ]);
            expect(queryKeys.attendance.detail("a-1")).toEqual(["attendance", "detail", "a-1"]);
        });
    });

    describe("inventory", () => {
        it("all, list, and detail return stable keys", () => {
            expect(queryKeys.inventory.all()).toEqual(["inventory"]);
            expect(queryKeys.inventory.list({ page: 3 })).toEqual([
                "inventory",
                "list",
                { page: 3 },
            ]);
            expect(queryKeys.inventory.detail("inv-1")).toEqual(["inventory", "detail", "inv-1"]);
        });
    });

    describe("payments", () => {
        it("all returns base key", () => {
            expect(queryKeys.payments.all()).toEqual(["payments"]);
        });

        it("list with params includes params", () => {
            const params = { limit: 20 };
            expect(queryKeys.payments.list(params)).toEqual(["payments", "list", params]);
        });

        it("detail includes the id", () => {
            expect(queryKeys.payments.detail("payment-1")).toEqual([
                "payments",
                "detail",
                "payment-1",
            ]);
        });
    });

    describe("users", () => {
        it("list and detail return stable keys", () => {
            expect(queryKeys.users.list({ role: "ADMIN" })).toEqual([
                "users",
                "list",
                { role: "ADMIN" },
            ]);
            expect(queryKeys.users.detail("user-1")).toEqual(["users", "detail", "user-1"]);
        });
    });

    it("each entity all() key is unique", () => {
        const keys = [
            queryKeys.members.all(),
            queryKeys.trainers.all(),
            queryKeys.equipment.all(),
            queryKeys.attendance.all(),
            queryKeys.inventory.all(),
            queryKeys.payments.all(),
            queryKeys.users.all(),
        ];
        const uniqueRoots = new Set(keys.map((k) => k[0]));
        expect(uniqueRoots.size).toBe(7);
    });
});

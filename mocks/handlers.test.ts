import { describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:3000/api/v1";

describe("MSW handlers", () => {
    it("serves auth endpoints", async () => {
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email: "admin@example.com", password: "Password1" }),
            headers: { "Content-Type": "application/json" },
        });
        const meResponse = await fetch(`${BASE_URL}/auth/me`);

        expect(loginResponse.status).toBe(200);
        await expect(loginResponse.json()).resolves.toMatchObject({
            accessToken: "mock-access-token",
            user: { email: "admin@example.com" },
        });
        await expect(meResponse.json()).resolves.toMatchObject({ email: "admin@example.com" });
    });

    it("serves members list and detail endpoints", async () => {
        const listResponse = await fetch(`${BASE_URL}/members`);
        const detailResponse = await fetch(`${BASE_URL}/members/member-42`);

        const listJson = await listResponse.json();
        const detailJson = await detailResponse.json();

        expect(listJson.meta.total).toBeGreaterThan(0);
        expect(Array.isArray(listJson.data)).toBe(true);
        expect(detailJson.id).toBe("member-42");
    });

    it("serves members create, update, and delete endpoints", async () => {
        const createResponse = await fetch(`${BASE_URL}/members`, {
            method: "POST",
            body: JSON.stringify({
                email: "new@example.com",
                firstName: "New",
                lastName: "Member",
            }),
            headers: { "Content-Type": "application/json" },
        });
        const updateResponse = await fetch(`${BASE_URL}/members/member-99`, {
            method: "PATCH",
            body: JSON.stringify({ firstName: "Updated" }),
            headers: { "Content-Type": "application/json" },
        });
        const deleteResponse = await fetch(`${BASE_URL}/members/member-99`, {
            method: "DELETE",
        });

        await expect(createResponse.json()).resolves.toMatchObject({
            id: "new-member-id",
            email: "new@example.com",
            firstName: "New",
            lastName: "Member",
        });
        await expect(updateResponse.json()).resolves.toMatchObject({
            id: "member-99",
            firstName: "Updated",
        });
        expect(deleteResponse.status).toBe(204);
    });
});

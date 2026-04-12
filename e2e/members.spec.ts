import { test, expect } from "@playwright/test";

const authUser = {
    id: "user-1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "ADMIN",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
};

async function seedAuth(page: Parameters<typeof test>[0]["page"]) {
    await page.context().addCookies([
        {
            name: "accessToken",
            value: "mock-access-token",
            url: "http://localhost:3001",
        },
    ]);

    await page.addInitScript((seedUser) => {
        window.localStorage.setItem("accessToken", "mock-access-token");
        window.localStorage.setItem("currentUser", JSON.stringify(seedUser));
    }, authUser);
}

test.describe("Members page", () => {
    test("loads, creates, edits, and deletes members", async ({ page }) => {
        await seedAuth(page);

        const trainers = [
            {
                id: "trainer-1",
                email: "sam@example.com",
                firstName: "Sam",
                lastName: "Coach",
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-01T00:00:00.000Z",
            },
        ];

        const members = [
            {
                id: "member-1",
                email: "alice@example.com",
                firstName: "Alice",
                lastName: "Smith",
                phone: "+15550001234",
                trainerId: "trainer-1",
                trainer: trainers[0],
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-01T00:00:00.000Z",
            },
        ];

        await page.route("**/api/v1/trainers**", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    data: trainers,
                    meta: { total: trainers.length, limit: 200, offset: 0, hasMore: false },
                }),
            });
        });

        await page.route("**/api/v1/members**", async (route) => {
            const method = route.request().method();

            if (method === "GET") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({
                        data: members,
                        meta: { total: members.length, limit: 10, offset: 0, hasMore: false },
                    }),
                });
                return;
            }

            if (method === "POST") {
                const body = JSON.parse(route.request().postData() ?? "{}");
                members.push({
                    id: "member-2",
                    email: body.email,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    phone: body.phone,
                    trainerId: body.trainerId || null,
                    trainer: trainers.find((trainer) => trainer.id === body.trainerId) ?? null,
                    createdAt: "2025-01-02T00:00:00.000Z",
                    updatedAt: "2025-01-02T00:00:00.000Z",
                });

                await route.fulfill({
                    status: 201,
                    contentType: "application/json",
                    body: JSON.stringify(members[members.length - 1]),
                });
                return;
            }

            await route.fallback();
        });

        await page.route("**/api/v1/members/*", async (route) => {
            const method = route.request().method();
            const id = route.request().url().split("/").pop() as string;

            if (method === "PATCH") {
                const body = JSON.parse(route.request().postData() ?? "{}");
                const index = members.findIndex((member) => member.id === id);
                members[index] = {
                    ...members[index],
                    ...body,
                    trainer: trainers.find((trainer) => trainer.id === body.trainerId) ?? members[index].trainer,
                };

                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(members[index]),
                });
                return;
            }

            if (method === "DELETE") {
                const index = members.findIndex((member) => member.id === id);
                members.splice(index, 1);
                await route.fulfill({ status: 204, body: "" });
                return;
            }

            await route.fallback();
        });

        page.on("dialog", async (dialog) => {
            await dialog.accept();
        });

        await page.goto("/members");
        await expect(page.getByRole("heading", { name: /members/i })).toBeVisible();
        await expect(page.getByText("Alice Smith")).toBeVisible();

        await page.getByRole("button", { name: /add member/i }).click();
        await page.getByLabel(/first name/i).fill("Bob");
        await page.getByLabel(/last name/i).fill("Jones");
        await page.getByLabel(/^email$/i).fill("bob@example.com");
        await page.getByLabel(/^phone$/i).fill("+15551112222");
        await page.getByLabel(/^password$/i).fill("Password1");
        await page.getByRole("combobox").nth(1).selectOption("trainer-1");
        await page.getByRole("button", { name: /create member/i }).click();

        await expect(page.getByText("Bob Jones")).toBeVisible();

        await page.getByRole("button", { name: /edit/i }).nth(0).click();
        const firstNameInput = page.getByLabel(/first name/i);
        await firstNameInput.clear();
        await firstNameInput.fill("Alicia");
        await page.getByRole("button", { name: /update member/i }).click();

        await expect(page.getByText("Alicia Smith")).toBeVisible();

        await page.getByRole("button", { name: /delete/i }).nth(1).click();
        await expect(page.getByText("Bob Jones")).toHaveCount(0);
    });
});

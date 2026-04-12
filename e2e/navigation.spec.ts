import { test, expect } from "@playwright/test";

const user = {
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
    }, user);
}

async function mockApis(page: Parameters<typeof test>[0]["page"]) {
    await page.route("**/api/v1/**", async (route) => {
        const url = route.request().url();

        if (url.includes("/members")) {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ data: [], meta: { total: 0, limit: 10, offset: 0, hasMore: false } }),
            });
            return;
        }

        if (url.includes("/trainers")) {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ data: [], meta: { total: 0, limit: 200, offset: 0, hasMore: false } }),
            });
            return;
        }

        if (url.includes("/attendance") || url.includes("/equipment") || url.includes("/payments")) {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ data: [], meta: { total: 0, limit: 200, offset: 0, hasMore: false } }),
            });
            return;
        }

        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({}) });
    });
}

test("sidebar navigation routes to members", async ({ page }) => {
    await seedAuth(page);
    await mockApis(page);

    await page.goto("/dashboard");
    await page.getByRole("link", { name: /members/i }).click();
    await expect(page).toHaveURL(/\/members$/);
    await expect(page.getByRole("heading", { name: /members/i })).toBeVisible();
});

test("unknown route renders not found page", async ({ page }) => {
    await seedAuth(page);
    await mockApis(page);

    await page.goto("/this-route-does-not-exist");
    await expect(page.locator("body")).toContainText("Page not found");
    await expect(page.locator("body")).toContainText("Go to dashboard");
});

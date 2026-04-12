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

async function mockDashboardApis(page: Parameters<typeof test>[0]["page"]) {
    await page.route("**/api/v1/members**", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: [], meta: { total: 0, limit: 10, offset: 0, hasMore: false } }),
        });
    });

    await page.route("**/api/v1/attendance**", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: [], meta: { total: 0, limit: 200, offset: 0, hasMore: false } }),
        });
    });

    await page.route("**/api/v1/equipment**", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: [], meta: { total: 0, limit: 200, offset: 0, hasMore: false } }),
        });
    });

    await page.route("**/api/v1/payments**", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: [], meta: { total: 0, limit: 200, offset: 0, hasMore: false } }),
        });
    });
}

test("redirects unauthenticated users from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
});

test("redirects authenticated users from /login to /dashboard", async ({ page }) => {
    await seedAuth(page);
    await mockDashboardApis(page);

    await page.goto("/login");
    await expect(page).toHaveURL(/\/dashboard$/);
});

test("shows validation errors for invalid login input", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.locator("form")).toContainText("Enter a valid email address");
    await expect(page.locator("form")).toContainText("Password is required");
});

test("logs in successfully and lands on dashboard", async ({ page }) => {
    await mockDashboardApis(page);

    await page.route("**/api/v1/auth/login", async (route) => {
        await route.fulfill({
            status: 200,
            headers: {
                "content-type": "application/json",
                "set-cookie": "accessToken=mock-access-token; Path=/; SameSite=Lax",
            },
            body: JSON.stringify({
                accessToken: "mock-access-token",
                user,
            }),
        });
    });

    await page.goto("/login");
    await page.context().addCookies([
        {
            name: "accessToken",
            value: "mock-access-token",
            url: "http://localhost:3001",
        },
    ]);
    await page.getByLabel(/email address/i).fill("admin@example.com");
    await page.getByLabel(/^password$/i).fill("Password1");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(/welcome back, admin/i)).toBeVisible();
});

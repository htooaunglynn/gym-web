import { describe, expect, it } from "vitest";
import { ROUTES } from "@/config/routes";

describe("ROUTES", () => {
    it("exports the main static routes", () => {
        expect(ROUTES.LOGIN).toBe("/login");
        expect(ROUTES.REGISTER).toBe("/register");
        expect(ROUTES.DASHBOARD).toBe("/dashboard");
        expect(ROUTES.MEMBERS).toBe("/members");
        expect(ROUTES.TRAINERS).toBe("/trainers");
        expect(ROUTES.EQUIPMENT).toBe("/equipment");
        expect(ROUTES.ATTENDANCE).toBe("/attendance");
        expect(ROUTES.INVENTORY).toBe("/inventory");
        expect(ROUTES.PAYMENTS).toBe("/payments");
        expect(ROUTES.SCHEDULE).toBe("/schedule");
        expect(ROUTES.LEAVE).toBe("/leave");
        expect(ROUTES.PERFORMANCE).toBe("/performance");
        expect(ROUTES.PAYROLL).toBe("/payroll");
        expect(ROUTES.RECRUITMENT).toBe("/recruitment");
        expect(ROUTES.INBOX).toBe("/inbox");
        expect(ROUTES.USERS).toBe("/users");
    });

    it("builds dynamic route helpers correctly", () => {
        expect(ROUTES.MEMBER_DETAIL("m-1")).toBe("/members/m-1");
        expect(ROUTES.MEMBER_EDIT("m-1")).toBe("/members/m-1/edit");
        expect(ROUTES.TRAINER_DETAIL("t-1")).toBe("/trainers/t-1");
        expect(ROUTES.TRAINER_EDIT("t-1")).toBe("/trainers/t-1/edit");
        expect(ROUTES.EQUIPMENT_DETAIL("e-1")).toBe("/equipment/e-1");
        expect(ROUTES.EQUIPMENT_EDIT("e-1")).toBe("/equipment/e-1/edit");
        expect(ROUTES.ATTENDANCE_DETAIL("a-1")).toBe("/attendance/a-1");
        expect(ROUTES.INVENTORY_DETAIL("i-1")).toBe("/inventory/i-1");
        expect(ROUTES.PAYMENT_DETAIL("p-1")).toBe("/payments/p-1");
        expect(ROUTES.USER_DETAIL("u-1")).toBe("/users/u-1");
        expect(ROUTES.USER_EDIT("u-1")).toBe("/users/u-1/edit");
    });
});

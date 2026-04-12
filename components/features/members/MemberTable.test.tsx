import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemberTable } from "@/components/features/members/MemberTable";
import { buildMember } from "@/mocks/factories";

const members = [
    buildMember({
        id: "m-1",
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        phone: "5550001234",
        trainer: {
            id: "t-1",
            firstName: "Sam",
            lastName: "Coach",
            email: "sam@example.com",
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
        },
    }),
    buildMember({
        id: "m-2",
        firstName: "Bob",
        lastName: "Jones",
        email: "bob@example.com",
        phone: undefined,
        trainer: null,
    }),
];

describe("MemberTable", () => {
    it("renders member rows", () => {
        render(<MemberTable members={members} onEdit={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByText("Alice Smith")).toBeDefined();
        expect(screen.getByText("Bob Jones")).toBeDefined();
        expect(screen.getByText("alice@example.com")).toBeDefined();
    });

    it("shows formatted phone numbers", () => {
        render(<MemberTable members={members} onEdit={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByText("(555) 000-1234")).toBeDefined();
    });

    it("shows trainer badge when trainer is assigned", () => {
        render(<MemberTable members={members} onEdit={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByText("Sam Coach")).toBeDefined();
    });

    it("shows 'Unassigned' when no trainer exists", () => {
        render(<MemberTable members={members} onEdit={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByText("Unassigned")).toBeDefined();
    });

    it("calls onEdit with the selected member", async () => {
        const user = userEvent.setup();
        const onEdit = vi.fn();
        render(<MemberTable members={members} onEdit={onEdit} onDelete={vi.fn()} />);

        const editButtons = screen.getAllByRole("button", { name: /edit/i });
        await user.click(editButtons[0]);
        expect(onEdit).toHaveBeenCalledWith(members[0]);
    });

    it("calls onDelete with the selected member", async () => {
        const user = userEvent.setup();
        const onDelete = vi.fn();
        render(<MemberTable members={members} onEdit={vi.fn()} onDelete={onDelete} />);

        const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
        await user.click(deleteButtons[1]);
        expect(onDelete).toHaveBeenCalledWith(members[1]);
    });

    it("disables delete buttons when isDeleting is true", () => {
        render(
            <MemberTable members={members} onEdit={vi.fn()} onDelete={vi.fn()} isDeleting />,
        );

        const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
        expect((deleteButtons[0] as HTMLButtonElement).disabled).toBe(true);
        expect((deleteButtons[1] as HTMLButtonElement).disabled).toBe(true);
    });

    it("renders empty state when members is empty", () => {
        render(<MemberTable members={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getByText("No members found.")).toBeDefined();
    });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemberForm } from "@/components/features/members/MemberForm";
import { buildMember } from "@/mocks/factories";

const trainers = [
    { id: "t-1", label: "Sam Coach" },
    { id: "t-2", label: "Jane Fit" },
];

describe("MemberForm create mode", () => {
    it("renders create submit button", () => {
        render(
            <MemberForm
                mode="create"
                trainers={trainers}
                onCancel={vi.fn()}
                onCreate={vi.fn()}
                onUpdate={vi.fn()}
            />,
        );

        expect(screen.getByRole("button", { name: /create member/i })).toBeDefined();
    });

    it("calls onCancel when cancel button is clicked", async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(
            <MemberForm
                mode="create"
                trainers={trainers}
                onCancel={onCancel}
                onCreate={vi.fn()}
                onUpdate={vi.fn()}
            />,
        );

        await user.click(screen.getByRole("button", { name: /cancel/i }));
        expect(onCancel).toHaveBeenCalledOnce();
    });

    it("shows validation errors on invalid submit", async () => {
        const user = userEvent.setup();
        render(
            <MemberForm
                mode="create"
                trainers={trainers}
                onCancel={vi.fn()}
                onCreate={vi.fn()}
                onUpdate={vi.fn()}
            />,
        );

        await user.click(screen.getByRole("button", { name: /create member/i }));

        await waitFor(() => {
            expect(screen.getByText("First name is required")).toBeDefined();
            expect(screen.getByText("Last name is required")).toBeDefined();
            expect(screen.getByText("Enter a valid email address")).toBeDefined();
        });
    });

    it("submits valid create values", async () => {
        const user = userEvent.setup();
        const onCreate = vi.fn();
        render(
            <MemberForm
                mode="create"
                trainers={trainers}
                onCancel={vi.fn()}
                onCreate={onCreate}
                onUpdate={vi.fn()}
            />,
        );

        await user.type(screen.getByLabelText(/first name/i), "Alex");
        await user.type(screen.getByLabelText(/last name/i), "Johnson");
        await user.type(screen.getByLabelText(/^email$/i), "alex@example.com");
        await user.type(screen.getByLabelText(/^phone$/i), "+15550001234");
        await user.type(screen.getByLabelText(/^password$/i), "Password1");
        await user.selectOptions(screen.getAllByRole("combobox")[0], "t-1");
        await user.click(screen.getByRole("button", { name: /create member/i }));

        await waitFor(() => {
            expect(onCreate).toHaveBeenCalledWith({
                email: "alex@example.com",
                firstName: "Alex",
                lastName: "Johnson",
                phone: "+15550001234",
                password: "Password1",
                trainerId: "t-1",
            });
        });
    });
});

describe("MemberForm edit mode", () => {
    const initialMember = buildMember({
        id: "m-1",
        email: "member@example.com",
        firstName: "Alice",
        lastName: "Smith",
        phone: "+15550001234",
        trainerId: "t-2",
    });

    it("pre-populates fields from initialMember", () => {
        render(
            <MemberForm
                mode="edit"
                trainers={trainers}
                initialMember={initialMember}
                onCancel={vi.fn()}
                onCreate={vi.fn()}
                onUpdate={vi.fn()}
            />,
        );

        expect((screen.getByLabelText(/first name/i) as HTMLInputElement).value).toBe("Alice");
        expect((screen.getByLabelText(/last name/i) as HTMLInputElement).value).toBe("Smith");
        expect((screen.getByLabelText(/^email$/i) as HTMLInputElement).value).toBe("member@example.com");
    });

    it("renders update submit button", () => {
        render(
            <MemberForm
                mode="edit"
                trainers={trainers}
                initialMember={initialMember}
                onCancel={vi.fn()}
                onCreate={vi.fn()}
                onUpdate={vi.fn()}
            />,
        );

        expect(screen.getByRole("button", { name: /update member/i })).toBeDefined();
    });

    it("submits valid update values", async () => {
        const user = userEvent.setup();
        const onUpdate = vi.fn();
        render(
            <MemberForm
                mode="edit"
                trainers={trainers}
                initialMember={initialMember}
                onCancel={vi.fn()}
                onCreate={vi.fn()}
                onUpdate={onUpdate}
            />,
        );

        const firstName = screen.getByLabelText(/first name/i);
        await user.clear(firstName);
        await user.type(firstName, "Alicia");
        await user.click(screen.getByRole("button", { name: /update member/i }));

        await waitFor(() => {
            expect(onUpdate).toHaveBeenCalledWith({
                email: "member@example.com",
                firstName: "Alicia",
                lastName: "Smith",
                phone: "+15550001234",
                trainerId: "t-2",
            });
        });
    });
});

import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CrudPageTemplate } from "@/components/shared/CrudPageTemplate";

describe("CrudPageTemplate", () => {
    it("renders loading state and add action", async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();

        render(
            <CrudPageTemplate
                title="Members"
                description="Manage member records"
                addLabel="Add Member"
                onAdd={onAdd}
                filters={<div>Filters</div>}
                isLoading
                isError={false}
                errorTitle="Could not load members"
                onRetry={vi.fn()}
                loadingText="Loading members..."
                tableContent={<div>Table</div>}
                currentPage={1}
                totalItems={0}
                pageSize={10}
                onPageChange={vi.fn()}
                panelMode={null}
            />
        );

        expect(screen.getByText("Loading members...")).toBeDefined();

        await user.click(screen.getByRole("button", { name: /add member/i }));
        expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it("renders success state, pagination, and panel content", () => {
        render(
            <CrudPageTemplate
                title="Members"
                description="Manage member records"
                addLabel="Add Member"
                onAdd={vi.fn()}
                filters={<div>Filters</div>}
                isLoading={false}
                isError={false}
                errorTitle="Could not load members"
                onRetry={vi.fn()}
                loadingText="Loading members..."
                tableContent={<div>Members table</div>}
                currentPage={2}
                totalItems={25}
                pageSize={10}
                onPageChange={vi.fn()}
                panelMode="edit"
                panelTitle="Edit member"
                panelDescription="Update member details"
                panelContent={<div>Member form</div>}
            />
        );

        expect(screen.getByText("Members table")).toBeDefined();
        expect(screen.getByText(/Page 2 \/ 3/)).toBeDefined();
        expect(screen.getByText("Edit member")).toBeDefined();
        expect(screen.getByText("Member form")).toBeDefined();
    });
});

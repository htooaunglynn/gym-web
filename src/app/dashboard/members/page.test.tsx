import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

const mockUseAuth = vi.fn();
const mockUsePermission = vi.fn();
const mockApiClient = vi.fn();

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ""} />,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/hooks/usePermission", () => ({
  usePermission: (...args: unknown[]) => mockUsePermission(...args),
}));

vi.mock("@/contexts/ToastContext", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock("@/lib/apiClient", () => ({
  apiClient: (...args: unknown[]) => mockApiClient(...args),
  normalizeListResponse: (response: { data?: unknown[] } | unknown[]) => {
    const data = Array.isArray(response) ? response : (response.data ?? []);
    return {
      data,
      meta: {
        totalItems: data.length,
        page: 1,
        limit: data.length || 20,
        totalPages: 1,
      },
    };
  },
}));

vi.mock("@/components/shared/PermissionGuard", () => ({
  PermissionGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/shared/PaginationControls", () => ({
  PaginationControls: () => <div>Pagination</div>,
}));

vi.mock("@/components/shared/ConfirmDialog", () => ({
  ConfirmDialog: () => null,
}));

vi.mock("@/components/forms/TrainerSelect", () => ({
  TrainerSelect: () => <div>Trainer Select</div>,
}));

vi.mock("@/components/crud/AddMemberModal", () => ({
  AddMemberModal: () => null,
}));

vi.mock("@/components/crud/DataTable", () => ({
  DataTable: ({ actions }: { actions?: Array<{ label: string }> }) => (
    <div>
      {(actions ?? []).map((action) => (
        <span key={action.label}>{action.label}</span>
      ))}
    </div>
  ),
}));

import MembersPage from "./page";

describe("MembersPage all-branches mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiClient.mockResolvedValue([]);
    mockUsePermission.mockReturnValue(true);
  });

  it("shows the read-only notice and hides write actions in All branches mode", async () => {
    mockUseAuth.mockReturnValue({
      user: { isAdmin: true, globalRole: "ADMIN" },
      activeBranchId: null,
    });

    render(<MembersPage />);

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalled();
    });

    expect(screen.getByText(/viewing all branches is read-only/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add member/i })).not.toBeInTheDocument();
    expect(screen.queryByText("Edit Details")).not.toBeInTheDocument();
    expect(screen.queryByText("Assign Trainer")).not.toBeInTheDocument();
    expect(screen.queryByText("Remove")).not.toBeInTheDocument();
  });

  it("shows write actions when a concrete branch is selected", async () => {
    mockUseAuth.mockReturnValue({
      user: { isAdmin: true, globalRole: "ADMIN" },
      activeBranchId: "branch-1",
    });

    render(<MembersPage />);

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalled();
    });

    expect(screen.queryByText(/viewing all branches is read-only/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add member/i })).toBeInTheDocument();
    expect(screen.getByText("Edit Details")).toBeInTheDocument();
    expect(screen.getByText("Assign Trainer")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });
});

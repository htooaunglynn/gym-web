import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

const { mockUseAuth, mockApiClient } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockApiClient: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/lib/apiClient", () => ({
  apiClient: mockApiClient,
  normalizeListResponse: (response: { data?: unknown[] } | unknown[]) => {
    const data = Array.isArray(response) ? response : (response.data ?? []);
    return {
      data,
      meta: {
        totalItems: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      },
    };
  },
}));

import { BranchSwitcher } from "./BranchSwitcher";

describe("BranchSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiClient.mockResolvedValue([
      { id: "branch-1", name: "Branch One" },
      { id: "branch-2", name: "Branch Two" },
    ]);
  });

  it("renders the All branches option for super admins and lists fetched branches", async () => {
    const setActiveBranchId = vi.fn();
    mockUseAuth.mockReturnValue({
      user: { globalRole: "ADMIN" },
      activeBranchId: null,
      setActiveBranchId,
    });

    render(<BranchSwitcher />);

    const select = await screen.findByRole("combobox", {
      name: /switch active branch/i,
    });

    expect(select).toBeInTheDocument();

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith("/branches");
    });

    expect(screen.getByRole("option", { name: /all branches/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /branch one/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /branch two/i })).toBeInTheDocument();
  });

  it("switches to a specific branch when a branch option is selected", async () => {
    const setActiveBranchId = vi.fn();
    mockUseAuth.mockReturnValue({
      user: { globalRole: "ADMIN" },
      activeBranchId: null,
      setActiveBranchId,
    });

    render(<BranchSwitcher />);

    const select = await screen.findByRole("combobox", {
      name: /switch active branch/i,
    });

    await act(async () => {
      fireEvent.change(select, { target: { value: "branch-2" } });
    });

    expect(setActiveBranchId).toHaveBeenCalledWith("branch-2");
  });

  it("switches to All branches when the all option is selected", async () => {
    const setActiveBranchId = vi.fn();
    mockUseAuth.mockReturnValue({
      user: { globalRole: "ADMIN" },
      activeBranchId: "branch-1",
      setActiveBranchId,
    });

    render(<BranchSwitcher />);

    const select = await screen.findByRole("combobox", {
      name: /switch active branch/i,
    });

    await act(async () => {
      fireEvent.change(select, { target: { value: "__all_branches__" } });
    });

    expect(setActiveBranchId).toHaveBeenCalledWith(null);
  });

  it("does not render for non-admin users", () => {
    mockUseAuth.mockReturnValue({
      user: { globalRole: "STAFF" },
      activeBranchId: "branch-1",
      setActiveBranchId: vi.fn(),
    });

    const { container } = render(<BranchSwitcher />);

    expect(container.firstChild).toBeNull();
    expect(mockApiClient).not.toHaveBeenCalled();
  });
});

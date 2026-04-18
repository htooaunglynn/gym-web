import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

const { mockApiClient } = vi.hoisted(() => ({
  mockApiClient: vi.fn(),
}));

vi.mock("@/lib/apiClient", () => {
  class MockApiClientError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }

  return {
    apiClient: mockApiClient,
    ApiClientError: MockApiClientError,
  };
});

import { AuthProvider, useAuth } from "./AuthContext";

function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return `${header}.${body}.fakesig`;
}

function futureExp() {
  return Math.floor(Date.now() / 1000) + 3600;
}

function Probe() {
  const { activeBranchId, setActiveBranchId, user } = useAuth();

  return (
    <div>
      <span data-testid="role">{user?.globalRole ?? "NONE"}</span>
      <span data-testid="branch-scope">{activeBranchId ?? "ALL"}</span>
      <button type="button" onClick={() => setActiveBranchId(null)}>
        Switch To All
      </button>
      <button type="button" onClick={() => setActiveBranchId("branch-override")}>
        Switch To Branch
      </button>
    </div>
  );
}

describe("AuthProvider branch scope", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockApiClient.mockResolvedValue({ permissions: [] });
  });

  it("defaults super admin to All branches when no stored branch exists", async () => {
    localStorage.setItem(
      "accessToken",
      makeJwt({
        sub: "admin-1",
        email: "admin@gym.local",
        globalRole: "ADMIN",
        role: "ADMIN",
        branchId: "home-branch",
        isAdmin: true,
        iat: 0,
        exp: futureExp(),
      }),
    );

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(screen.getByTestId("role")).toHaveTextContent("ADMIN");
    expect(screen.getByTestId("branch-scope")).toHaveTextContent("ALL");

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalled();
    });
  });

  it("restores a stored super admin branch selection", async () => {
    localStorage.setItem(
      "accessToken",
      makeJwt({
        sub: "admin-1",
        email: "admin@gym.local",
        globalRole: "ADMIN",
        role: "ADMIN",
        branchId: "home-branch",
        isAdmin: true,
        iat: 0,
        exp: futureExp(),
      }),
    );
    localStorage.setItem("activeBranchId", "branch-2");

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(screen.getByTestId("branch-scope")).toHaveTextContent("branch-2");

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalled();
    });
  });

  it("pins non-admin users to their jwt branch even if a stale admin branch is stored", async () => {
    localStorage.setItem(
      "accessToken",
      makeJwt({
        sub: "staff-1",
        email: "staff@gym.local",
        globalRole: "STAFF",
        role: "STAFF",
        branchId: "staff-branch",
        isAdmin: false,
        iat: 0,
        exp: futureExp(),
      }),
    );
    localStorage.setItem("activeBranchId", "stale-admin-branch");

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(screen.getByTestId("role")).toHaveTextContent("STAFF");
    expect(screen.getByTestId("branch-scope")).toHaveTextContent("staff-branch");

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalled();
    });
  });

  it("clears stored branch selection when a super admin switches back to All branches", async () => {
    localStorage.setItem(
      "accessToken",
      makeJwt({
        sub: "admin-1",
        email: "admin@gym.local",
        globalRole: "ADMIN",
        role: "ADMIN",
        branchId: "home-branch",
        isAdmin: true,
        iat: 0,
        exp: futureExp(),
      }),
    );
    localStorage.setItem("activeBranchId", "branch-2");

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /switch to all/i }));
    });

    expect(screen.getByTestId("branch-scope")).toHaveTextContent("ALL");
    expect(localStorage.getItem("activeBranchId")).toBeNull();
  });
});

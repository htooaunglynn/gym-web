import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";

// Mock the AuthContext
const mockLogin = vi.fn();
vi.mock("@/lib/auth/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn() }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders gym name from prop", () => {
    render(<LoginForm gymName="Titan Gym" />);
    expect(screen.getByText("Titan Gym")).toBeDefined();
  });

  it("error banner shown on 401 (not field-level)", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Incorrect email or password"));
    
    render(<LoginForm gymName="Titan Gym" />);
    
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Incorrect email or password")).toBeDefined();
    });
  });

  it("loading spinner visible during submission", async () => {
    let resolveLogin: any;
    mockLogin.mockImplementation(() => new Promise((res) => {
      resolveLogin = res;
    }));

    render(<LoginForm gymName="Titan Gym" />);
    
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Signing in.../i)).toBeDefined();
    });

    resolveLogin(); // cleanup
  });
});

/**
 * Unit + property-based tests for LoginForm
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.8
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, within, cleanup } from "@testing-library/react";
import fc from "fast-check";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockLogin = vi.fn();
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function renderLoginForm() {
  const { LoginForm } = await import("./LoginForm");
  const result = render(<LoginForm />);
  return result;
}

/** Query helpers scoped to a container to avoid cross-test pollution */
function getSubmitButton(container: HTMLElement) {
  return within(container).getByRole("button", { name: /^log in$/i });
}

function getEmailInput(container: HTMLElement) {
  return within(container).getByRole("textbox", { name: /email address/i });
}

function getPasswordInput(container: HTMLElement) {
  // Use the id directly to avoid matching the "Show password" toggle button
  return container.querySelector<HTMLInputElement>("#password")!;
}

// ─── Unit tests ───────────────────────────────────────────────────────────────

describe("LoginForm – submit button disabled state (Req 2.8)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("submit button is disabled when both fields are empty", async () => {
    const { container } = await renderLoginForm();
    expect(getSubmitButton(container)).toBeDisabled();
  });

  it("submit button is disabled when only email is filled", async () => {
    const { container } = await renderLoginForm();
    fireEvent.change(getEmailInput(container), {
      target: { value: "user@example.com" },
    });
    expect(getSubmitButton(container)).toBeDisabled();
  });

  it("submit button is disabled when only password is filled", async () => {
    const { container } = await renderLoginForm();
    fireEvent.change(getPasswordInput(container), {
      target: { value: "secret" },
    });
    expect(getSubmitButton(container)).toBeDisabled();
  });

  it("submit button is enabled when both fields are non-empty", async () => {
    const { container } = await renderLoginForm();
    fireEvent.change(getEmailInput(container), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(getPasswordInput(container), {
      target: { value: "secret" },
    });
    expect(getSubmitButton(container)).not.toBeDisabled();
  });

  it("submit button is disabled when email is whitespace only", async () => {
    const { container } = await renderLoginForm();
    fireEvent.change(getEmailInput(container), { target: { value: "   " } });
    fireEvent.change(getPasswordInput(container), {
      target: { value: "secret" },
    });
    expect(getSubmitButton(container)).toBeDisabled();
  });
});

describe("LoginForm – inline validation (Req 2.2, 2.4)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("shows email error after blurring empty email field", async () => {
    const { container } = await renderLoginForm();
    fireEvent.blur(getEmailInput(container));
    expect(within(container).getByText(/email is required/i)).toBeDefined();
  });

  it("shows email format error for invalid email", async () => {
    const { container } = await renderLoginForm();
    fireEvent.change(getEmailInput(container), {
      target: { value: "not-an-email" },
    });
    fireEvent.blur(getEmailInput(container));
    expect(within(container).getByText(/valid email/i)).toBeDefined();
  });

  it("shows password required error after blurring empty password", async () => {
    const { container } = await renderLoginForm();
    fireEvent.blur(getPasswordInput(container));
    expect(within(container).getByText(/password is required/i)).toBeDefined();
  });

  it("clears email error when user types a valid email", async () => {
    const { container } = await renderLoginForm();
    fireEvent.change(getEmailInput(container), { target: { value: "bad" } });
    fireEvent.blur(getEmailInput(container));
    expect(within(container).getByText(/valid email/i)).toBeDefined();
    // Now type a valid email
    fireEvent.change(getEmailInput(container), {
      target: { value: "good@example.com" },
    });
    expect(within(container).queryByText(/valid email/i)).toBeNull();
  });
});

describe("LoginForm – account type selector (Req 2.1)", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders account type selector with USER and MEMBER options", async () => {
    const { container } = await renderLoginForm();
    const select = within(container).getByRole("combobox", {
      name: /account type/i,
    });
    expect(select).toBeDefined();
    expect(within(container).getByText(/staff \/ admin/i)).toBeDefined();
    expect(within(container).getByText(/member/i)).toBeDefined();
  });
});

describe("LoginForm – password visibility toggle", () => {
  beforeEach(() => {
    cleanup();
  });

  it("toggles password field type when show/hide button is clicked", async () => {
    const { container } = await renderLoginForm();
    const passwordInput = getPasswordInput(container);
    expect(passwordInput.getAttribute("type")).toBe("password");

    const toggleBtn = within(container).getByRole("button", {
      name: /show password/i,
    });
    fireEvent.click(toggleBtn);
    expect(passwordInput.getAttribute("type")).toBe("text");

    fireEvent.click(
      within(container).getByRole("button", { name: /hide password/i }),
    );
    expect(passwordInput.getAttribute("type")).toBe("password");
  });
});

// ─── Property-based tests ─────────────────────────────────────────────────────

/**
 * Property 5: Login form submit disabled when email or password is empty
 * Validates: Requirements 2.8
 */
describe("Property 5 – Submit disabled when email or password is empty", () => {
  it("submit is always disabled when email is empty/whitespace regardless of password", async () => {
    const { LoginForm } = await import("./LoginForm");

    await fc.assert(
      fc.asyncProperty(
        // Empty or whitespace-only email
        fc.oneof(
          fc.constant(""),
          fc
            .array(fc.constantFrom(" ", "\t"), { minLength: 1, maxLength: 10 })
            .map((chars) => chars.join("")),
        ),
        // Any non-empty password
        fc.string({ minLength: 1, maxLength: 50 }),
        async (email, password) => {
          cleanup();
          const { container } = render(<LoginForm />);

          const emailInput =
            container.querySelector<HTMLInputElement>("#email")!;
          const passwordInput =
            container.querySelector<HTMLInputElement>("#password")!;
          const submitBtn = within(container).getByRole("button", {
            name: /^log in$/i,
          });

          fireEvent.change(emailInput, { target: { value: email } });
          fireEvent.change(passwordInput, { target: { value: password } });

          expect(submitBtn).toBeDisabled();
        },
      ),
      { numRuns: 30 },
    );
  });

  it("submit is always disabled when password is empty regardless of email", async () => {
    const { LoginForm } = await import("./LoginForm");

    await fc.assert(
      fc.asyncProperty(
        // Any non-empty, non-whitespace email
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => s.trim().length > 0),
        async (email) => {
          cleanup();
          const { container } = render(<LoginForm />);

          const emailInput =
            container.querySelector<HTMLInputElement>("#email")!;
          const submitBtn = within(container).getByRole("button", {
            name: /^log in$/i,
          });

          fireEvent.change(emailInput, { target: { value: email } });
          // password stays empty

          expect(submitBtn).toBeDisabled();
        },
      ),
      { numRuns: 30 },
    );
  });
});

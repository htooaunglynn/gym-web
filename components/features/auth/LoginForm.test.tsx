import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/test-utils";
import { LoginForm } from "@/components/features/auth/LoginForm";
import * as authService from "@/services/auth";
import { buildAuthResponse } from "@/mocks/factories";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/login",
    useSearchParams: () => new URLSearchParams(),
    redirect: vi.fn(),
}));

vi.mock("@/services/auth", async () => {
    const actual = await vi.importActual<typeof import("@/services/auth")>("@/services/auth");
    return {
        ...actual,
        login: vi.fn(),
    };
});

const mockLogin = vi.mocked(authService.login);

beforeEach(() => {
    vi.clearAllMocks();
});

describe("LoginForm", () => {
    it("renders account type, email, password, and submit button", () => {
        render(<LoginForm />);

        expect(screen.getByRole("combobox")).toBeDefined();
        expect(screen.getByLabelText(/email address/i)).toBeDefined();
        expect(screen.getByLabelText(/^password$/i)).toBeDefined();
        expect(screen.getByRole("button", { name: /sign in/i })).toBeDefined();
    });

    it("shows validation errors on invalid submit", async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        await user.click(screen.getByRole("button", { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText("Enter a valid email address")).toBeDefined();
            expect(screen.getByText("Password is required")).toBeDefined();
        });
    });

    it("toggles password visibility", async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
        expect(passwordInput.type).toBe("password");

        await user.click(screen.getByRole("button", { name: /show password/i }));
        expect(passwordInput.type).toBe("text");

        await user.click(screen.getByRole("button", { name: /hide password/i }));
        expect(passwordInput.type).toBe("password");
    });

    it("submits valid credentials and routes to dashboard on success", async () => {
        const user = userEvent.setup();
        mockLogin.mockResolvedValueOnce(buildAuthResponse());
        render(<LoginForm />);

        await user.selectOptions(screen.getByRole("combobox"), "USER");
        await user.type(screen.getByLabelText(/email address/i), "admin@example.com");
        await user.type(screen.getByLabelText(/^password$/i), "Password1");
        await user.click(screen.getByRole("button", { name: /sign in/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
            expect(mockLogin.mock.calls[0]?.[0]).toEqual({
                accountType: "USER",
                email: "admin@example.com",
                password: "Password1",
            });
        });

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/dashboard");
        });
    });
});

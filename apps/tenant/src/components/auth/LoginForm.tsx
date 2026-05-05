"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClientError, apiClient } from "@/lib/apiClient";

type AccountType = "USER" | "MEMBER";

interface FieldErrors {
    email?: string;
    password?: string;
    general?: string;
}

/** Validate email format (RFC-ish, max 254 chars) */
function validateEmail(value: string): string | undefined {
    if (!value.trim()) return "Email is required";
    if (value.length > 254) return "Email must be 254 characters or fewer";
    // Basic RFC email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return "Enter a valid email address";
    return undefined;
}

function validatePassword(value: string): string | undefined {
    if (!value) return "Password is required";
    return undefined;
}

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState<AccountType>("USER");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    // Track which fields have been touched (blurred) to show inline errors
    const [touched, setTouched] = useState<{ email: boolean; password: boolean }>(
        { email: false, password: false },
    );

    const router = useRouter();
    const { login } = useAuth();

    // Submit is enabled only when both fields are non-empty and not loading
    const isFormValid = email.trim().length > 0 && password.length > 0;

    const handleBlur = (field: "email" | "password") => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        if (field === "email") {
            const err = validateEmail(email);
            setFieldErrors((prev) => ({ ...prev, email: err }));
        }
        if (field === "password") {
            const err = validatePassword(password);
            setFieldErrors((prev) => ({ ...prev, password: err }));
        }
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        // Clear inline error as user types (re-validate only after blur)
        if (touched.email) {
            setFieldErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        // Clear the 401 "Invalid credentials" error when user starts retyping
        if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Run full validation before submit
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        setTouched({ email: true, password: true });
        setFieldErrors({ email: emailErr, password: passwordErr });

        if (emailErr || passwordErr) return;

        setLoading(true);
        setFieldErrors({});

        try {
            const data = await apiClient<{ accessToken?: string }>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password, accountType }),
            });

            // Req 2.3: store token via AuthContext.login(), then redirect
            if (data.accessToken) {
                await login(data.accessToken);
                router.push("/dashboard");
            }
        } catch (err) {
            if (err instanceof ApiClientError) {
                if (err.status === 401) {
                    setFieldErrors({ password: "Invalid credentials" });
                    return;
                }
                if (err.status === 400) {
                    setFieldErrors({ general: err.message || "Invalid request" });
                    return;
                }
                setFieldErrors({
                    general: err.message || "Failed to login. Please check your credentials.",
                });
                return;
            }

            setFieldErrors({ general: "Unable to reach the server. Check your connection." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[1000px] min-h-[600px] bg-white dark:bg-gray-900 rounded-[30px] shadow-2xl flex overflow-hidden">
            {/* Left Illustration Side */}
            <div className="hidden md:block md:w-[45%] relative bg-gray-100 dark:bg-gray-800">
                <Image
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2670&auto=format&fit=crop"
                    alt="Gym Illustration"
                    fill
                    className="object-cover opacity-90 saturate-50 mix-blend-multiply"
                />
                <div
                    className="absolute inset-0 bg-[#E2F1ED]/50 mix-blend-color-burn"
                    aria-hidden="true"
                />
            </div>

            {/* Right Login Form Side */}
            <div className="w-full md:w-[55%] flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 py-12 relative">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                    Log in
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 text-center max-w-[250px]">
                    Login with your email and password
                </p>

                {/* General / server error banner */}
                {fieldErrors.general && (
                    <div
                        role="alert"
                        className="w-full flex items-center justify-center p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm"
                    >
                        {fieldErrors.general}
                    </div>
                )}

                <form
                    onSubmit={handleLogin}
                    className="w-full flex flex-col gap-4"
                    noValidate
                >
                    {/* Account Type selector — Req 2.1 */}
                    <div>
                        <label
                            htmlFor="accountType"
                            className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1"
                        >
                            Account type
                        </label>
                        <select
                            id="accountType"
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value as AccountType)}
                            aria-label="Account type"
                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none border border-transparent focus:border-gray-200 dark:focus:border-gray-700 transition-colors text-sm appearance-none cursor-pointer"
                        >
                            <option value="USER">Staff / Admin</option>
                            <option value="MEMBER">Member</option>
                        </select>
                    </div>

                    {/* Email field */}
                    <div>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                onBlur={() => handleBlur("email")}
                                maxLength={254}
                                required
                                aria-label="Email address"
                                aria-describedby={
                                    touched.email && fieldErrors.email ? "email-error" : undefined
                                }
                                aria-invalid={
                                    touched.email && !!fieldErrors.email ? "true" : "false"
                                }
                                className={`w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none border transition-colors text-sm placeholder:text-gray-400 ${touched.email && fieldErrors.email
                                        ? "border-red-400 dark:border-red-500 focus:border-red-400"
                                        : "border-transparent focus:border-gray-200 dark:focus:border-gray-700"
                                    }`}
                            />
                        </div>
                        {/* Inline email error — Req 2.2, 2.8 */}
                        {touched.email && fieldErrors.email && (
                            <p
                                id="email-error"
                                role="alert"
                                className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1"
                            >
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    {/* Password field */}
                    <div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                onBlur={() => handleBlur("password")}
                                required
                                aria-label="Password"
                                aria-describedby={
                                    touched.password && fieldErrors.password
                                        ? "password-error"
                                        : undefined
                                }
                                aria-invalid={
                                    touched.password && !!fieldErrors.password ? "true" : "false"
                                }
                                className={`w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none border transition-colors text-sm placeholder:text-gray-400 ${touched.password && fieldErrors.password
                                        ? "border-red-400 dark:border-red-500 focus:border-red-400"
                                        : "border-transparent focus:border-gray-200 dark:focus:border-gray-700"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {/* Inline password error (empty field or 401 "Invalid credentials") — Req 2.4, 2.8 */}
                        {touched.password && fieldErrors.password && (
                            <p
                                id="password-error"
                                role="alert"
                                className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1"
                            >
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit button — disabled when form invalid or loading (Req 2.5, 2.8) */}
                    <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        aria-busy={loading}
                        className="w-full bg-[#34445c] hover:bg-[#283547] text-white font-medium text-sm py-4 rounded-full transition-colors mt-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in…" : "Log in"}
                    </button>
                </form>

                <div className="w-full flex items-center gap-4 my-8">
                    <span className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800" />
                    <span className="text-xs text-gray-400">or log in with</span>
                    <span className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800" />
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <button
                        aria-label="Log in with Google"
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-shadow"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                fill="#EA4335"
                                d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                            />
                            <path
                                fill="#34A853"
                                d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                            />
                            <path
                                fill="#4A90E2"
                                d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                            />
                        </svg>
                    </button>
                    <button
                        aria-label="Log in with Microsoft"
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-shadow"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 21 21"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path fill="#f25022" d="M0 0h10v10H0z" />
                            <path fill="#7fba00" d="M11 0h10v10H11z" />
                            <path fill="#00a4ef" d="M0 11h10v10H0z" />
                            <path fill="#ffb900" d="M11 11h10v10H11z" />
                        </svg>
                    </button>
                </div>

                <Link
                    href="#"
                    className="mt-auto text-xs text-[#E62A29] hover:underline font-medium"
                >
                    Forgot login or password?
                </Link>
            </div>
        </div>
    );
}

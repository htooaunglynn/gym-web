"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          accountType: "USER", // Hardcoded constraint
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to login. Please check your credentials.");
      }

      // Successful login
      // Expected: data.accessToken
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        window.location.href = "/dashboard"; // Redirect to admin dashboard
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1000px] h-[600px] bg-white dark:bg-gray-900 rounded-[30px] shadow-2xl flex overflow-hidden">
      {/* Left Illustration Side */}
      <div className="hidden md:block md:w-[45%] relative bg-gray-100 dark:bg-gray-800">
        <Image
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2670&auto=format&fit=crop"
          alt="Gym Illustration"
          fill
          className="object-cover opacity-90 saturate-50 mix-blend-multiply"
        />
        {/* Simple gradient overlay to give it the stylized illustration feel from the mockup */}
        <div className="absolute inset-0 bg-[#E2F1ED]/50 mix-blend-color-burn" aria-hidden="true" />
      </div>

      {/* Right Login Form Side */}
      <div className="w-full md:w-[55%] flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 py-12 relative">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-heading">Log in</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 text-center max-w-[250px]">
          Login, email or phone number
        </p>

        {error && (
          <div className="w-full flex items-center justify-center p-3 mb-4 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
              className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none border border-transparent focus:border-gray-200 dark:focus:border-gray-700 transition-colors text-sm placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
              className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none border border-transparent focus:border-gray-200 dark:focus:border-gray-700 transition-colors text-sm placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#34445c] hover:bg-[#283547] text-white font-medium text-sm py-4 rounded-full transition-colors mt-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="w-full flex items-center gap-4 my-8">
          <span className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800" />
          <span className="text-xs text-gray-400">or log in with</span>
          <span className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="flex items-center gap-4 mb-8">
          {/* Mockup Social Icons */}
          <button aria-label="Log in with Google" className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-shadow">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
              <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
              <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
              <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
            </svg>
          </button>
          <button aria-label="Log in with Microsoft" className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-shadow">
            <svg className="w-5 h-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f25022" d="M0 0h10v10H0z"/>
              <path fill="#7fba00" d="M11 0h10v10H11z"/>
              <path fill="#00a4ef" d="M0 11h10v10H0z"/>
              <path fill="#ffb900" d="M11 11h10v10H11z"/>
            </svg>
          </button>
        </div>

        <Link href="#" className="mt-auto text-xs text-[#E62A29] hover:underline font-medium">
          Forgot login or password?
        </Link>
      </div>
    </div>
  );
}

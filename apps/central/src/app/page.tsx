import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Gym SaaS Central Admin",
};

export default function LoginRedirect() {
  // Root "/" redirects to the dashboard overview
  redirect("/(dashboard)/overview");
}

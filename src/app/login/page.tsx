import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in | FIYKIT",
  description: "Log in to your admin account. Members and trainers cannot login here.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E5F2EE] dark:bg-gray-950 p-4">
      {/* Background graphic elements simulating the mockup vector style */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full border-[1px] border-[#c0ddd4]/50 dark:border-gray-800" />
        <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] rounded-full border-[1px] border-[#c0ddd4]/50 dark:border-gray-800" />
      </div>
      
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

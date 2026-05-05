import type { Metadata } from "next";

export const metadata: Metadata = { title: "Central Users" };

export default function UsersPage() {
  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f1f1f4] tracking-tight">Central Users</h1>
          <p className="text-sm text-[#9898b0] mt-1">Superadmin accounts and access control</p>
        </div>
        <button className="px-5 py-2.5 bg-[#6c63ff] hover:bg-[#5a52e8] text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-[#6c63ff]/30">
          + Invite User
        </button>
      </div>
      <div className="bg-[#1a1a22] border border-[#2e2e3e] rounded-2xl overflow-hidden">
        <div className="p-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-[#22222e] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

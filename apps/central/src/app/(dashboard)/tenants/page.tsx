import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tenants" };

export default function TenantsPage() {
  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f1f1f4] tracking-tight">Tenants</h1>
          <p className="text-sm text-[#9898b0] mt-1">Manage all gym tenants and their domains</p>
        </div>
        <button className="px-5 py-2.5 bg-[#6c63ff] hover:bg-[#5a52e8] text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-[#6c63ff]/30">
          + Add Tenant
        </button>
      </div>
      <div className="bg-[#1a1a22] border border-[#2e2e3e] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#2e2e3e]">
          <input
            type="search"
            placeholder="Search tenants…"
            className="w-full max-w-sm px-4 py-2 bg-[#22222e] border border-[#2e2e3e] rounded-xl text-sm text-[#f1f1f4] placeholder-[#9898b0] focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50"
          />
        </div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-[#22222e] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return (
    <div className="animate-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#f1f1f4] tracking-tight">Overview</h1>
        <p className="text-sm text-[#9898b0] mt-1">Platform-wide metrics and health</p>
      </div>

      {/* KPI grid — placeholder */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {["Total Tenants", "Active Subscriptions", "MRR", "Uptime"].map((label) => (
          <div
            key={label}
            className="bg-[#1a1a22] border border-[#2e2e3e] rounded-2xl p-5 space-y-2"
          >
            <p className="text-xs text-[#9898b0] font-medium uppercase tracking-wider">{label}</p>
            <div className="h-7 w-20 bg-[#22222e] rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Recent tenants placeholder */}
      <div className="bg-[#1a1a22] border border-[#2e2e3e] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-[#f1f1f4] mb-4">Recent Tenants</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-[#22222e] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

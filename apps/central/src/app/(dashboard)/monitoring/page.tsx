import type { Metadata } from "next";

export const metadata: Metadata = { title: "Monitoring" };

export default function MonitoringPage() {
  return (
    <div className="animate-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#f1f1f4] tracking-tight">Monitoring</h1>
        <p className="text-sm text-[#9898b0] mt-1">Database health, uptime, and tenant-DB status</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Registry DB", "Tenant DBs", "API Latency", "Error Rate"].map((label) => (
          <div
            key={label}
            className="bg-[#1a1a22] border border-[#2e2e3e] rounded-2xl p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#f1f1f4]">{label}</p>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Healthy
              </span>
            </div>
            <div className="h-20 bg-[#22222e] rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Audit Logs" };

export default function AuditLogsPage() {
  return (
    <div className="animate-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#f1f1f4] tracking-tight">Audit Logs</h1>
        <p className="text-sm text-[#9898b0] mt-1">Full audit trail of all superadmin and tenant actions</p>
      </div>
      <div className="bg-[#1a1a22] border border-[#2e2e3e] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-[#2e2e3e] text-xs font-semibold text-[#9898b0] uppercase tracking-wider">
          {["Timestamp", "Actor", "Role", "Action", "Resource"].map((h) => <span key={h}>{h}</span>)}
        </div>
        <div className="p-4 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 bg-[#22222e] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

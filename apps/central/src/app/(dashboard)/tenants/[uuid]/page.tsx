import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tenant Detail" };

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function TenantDetailPage({ params }: Props) {
  const { uuid } = await params;

  return (
    <div className="animate-in space-y-6">
      <div>
        <p className="text-xs text-[#9898b0] mb-1 font-mono">{uuid}</p>
        <h1 className="text-3xl font-bold text-[#f1f1f4] tracking-tight">Tenant Detail</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info card */}
        <div className="bg-[#1a1a22] border border-[#2e2e3e] rounded-2xl p-6 lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-[#f1f1f4]">Details</h2>
          {["Name", "Domain", "Plan", "Status", "Created"].map((field) => (
            <div key={field} className="flex items-center justify-between py-2 border-b border-[#2e2e3e] last:border-0">
              <span className="text-sm text-[#9898b0] font-medium">{field}</span>
              <div className="h-4 w-32 bg-[#22222e] rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Actions card */}
        <div className="bg-[#1a1a22] border border-[#2e2e3e] rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-semibold text-[#f1f1f4]">Actions</h2>
          {["Edit Tenant", "Suspend", "Delete"].map((action) => (
            <button
              key={action}
              className={[
                "w-full py-2.5 rounded-xl text-sm font-semibold transition-colors",
                action === "Delete"
                  ? "bg-[#e84c4c]/10 text-[#e84c4c] hover:bg-[#e84c4c]/20"
                  : "bg-[#22222e] text-[#f1f1f4] hover:bg-[#2e2e3e]",
              ].join(" ")}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

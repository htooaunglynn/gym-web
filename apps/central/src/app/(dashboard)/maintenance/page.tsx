import type { Metadata } from "next";

export const metadata: Metadata = { title: "Maintenance" };

export default function MaintenancePage() {
  return (
    <div className="animate-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#f1f1f4] tracking-tight">Maintenance</h1>
        <p className="text-sm text-[#9898b0] mt-1">
          Run cross-tenant migrations and database operations.{" "}
          <span className="text-[#e84c4c] font-semibold">Superadmin only.</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Run Migrations", desc: "Apply pending Prisma migrations to all tenant DBs", danger: false },
          { label: "Rotate Credentials", desc: "Rotate database connection strings for all tenants", danger: false },
          { label: "Purge Cache", desc: "Clear Redis cache for all tenant sessions", danger: false },
          { label: "Drop Tenant DB", desc: "Permanently delete a tenant database", danger: true },
        ].map(({ label, desc, danger }) => (
          <div
            key={label}
            className={[
              "bg-[#1a1a22] border rounded-2xl p-6 space-y-3",
              danger ? "border-[#e84c4c]/30" : "border-[#2e2e3e]",
            ].join(" ")}
          >
            <h2 className={["text-base font-semibold", danger ? "text-[#e84c4c]" : "text-[#f1f1f4]"].join(" ")}>
              {label}
            </h2>
            <p className="text-sm text-[#9898b0]">{desc}</p>
            <button
              className={[
                "w-full py-2.5 rounded-xl text-sm font-bold transition-colors",
                danger
                  ? "bg-[#e84c4c]/10 text-[#e84c4c] hover:bg-[#e84c4c]/20"
                  : "bg-[#6c63ff]/10 text-[#6c63ff] hover:bg-[#6c63ff]/20",
              ].join(" ")}
            >
              Execute
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Subscription Plans" };

export default function PlansPage() {
  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f1f1f4] tracking-tight">Subscription Plans</h1>
          <p className="text-sm text-[#9898b0] mt-1">Define and manage platform subscription tiers</p>
        </div>
        <button className="px-5 py-2.5 bg-[#6c63ff] hover:bg-[#5a52e8] text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-[#6c63ff]/30">
          + New Plan
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Starter", "Professional", "Enterprise"].map((name) => (
          <div key={name} className="bg-[#1a1a22] border border-[#2e2e3e] rounded-2xl p-6 space-y-3">
            <p className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider">{name}</p>
            <div className="h-8 w-24 bg-[#22222e] rounded-lg animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#22222e] rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

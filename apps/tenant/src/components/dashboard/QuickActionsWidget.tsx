import { Plus } from "lucide-react";

export function QuickActionsWidget() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-gray-900 font-bold text-base flex items-center gap-2">
          {/* Card Icon placeholder */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
          Quick Actions
        </h2>
        <button className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
          <Plus className="w-4 h-4" /> Add new
        </button>
      </div>

      <div className="grid grid-cols-[1fr_0.6fr] gap-4">
        {/* Black Card styled widget */}
        <div className="bg-[#1C1F26] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          {/* Background circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full translate-x-8 -translate-y-8" />
          
          <div className="flex justify-between items-start z-10">
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold leading-none flex items-center gap-1.5">
              <StatusSignal /> Active
            </span>
            {/* Mastercard-like overlapping circles */}
            <div className="flex">
              <div className="w-6 h-6 rounded-full bg-[#FF3B30] opacity-80" />
              <div className="w-6 h-6 rounded-full bg-[#FF9500] opacity-80 -ml-2 mix-blend-screen" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-auto z-10 w-full text-left bottom-element">
            <div>
              <div className="text-[10px] text-gray-400 font-medium mb-1">ID Number</div>
              <div className="text-sm font-bold tracking-widest text-[#FF9500]">•••• 6782</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-medium mb-1">EXP</div>
              <div className="text-sm font-bold">09/29</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-medium mb-1">CVV</div>
              <div className="text-sm font-bold">611</div>
            </div>
          </div>
        </div>

        {/* Orange Card styled widget */}
        <div className="bg-[#FF5C39] rounded-2xl p-5 text-white shadow-xl shadow-[#FF5C39]/30 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
           {/* Background stars/diamonds */}
           <div className="absolute top-4 right-4 w-2 h-2 rotate-45 bg-white/40" />
           <div className="absolute bottom-8 left-8 w-1 h-1 rotate-45 bg-white/40" />
           <div className="absolute top-1/2 left-1/4 w-3 h-3 rotate-45 bg-white/20" />

           <div className="flex justify-between items-start z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold leading-none flex items-center gap-1.5">
              <StatusSignal /> Active
            </span>
          </div>

          <div className="mt-auto z-10">
            <div className="text-[10px] text-white/70 font-medium mb-1">ID Number</div>
            <div className="text-sm font-bold tracking-widest text-white/90">•••• 4356</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusSignal() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
      <path d="M4 12V12.01" />
      <path d="M8 8a6 6 0 0 1 0 8" />
      <path d="M12 4a10 10 0 0 1 0 16" />
      <path d="M16 0a14 14 0 0 1 0 24" />
    </svg>
  );
}

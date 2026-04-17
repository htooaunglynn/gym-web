import {
  ArrowLeftRight,
  UserPlus,
  CreditCard,
  Droplet,
  Star,
} from "lucide-react";

export function StatsOverview({ totalMembers = 0 }: { totalMembers?: number }) {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Top Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-gray-500 font-medium text-sm mb-1">
            Total Active Members
          </h2>
          <div className="flex items-end gap-3">
            <span className="text-4xl lg:text-[42px] font-bold text-gray-900 leading-none">
              {totalMembers.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center text-xs font-bold bg-[#E6F8ED] text-[#33D073] px-2 py-1 rounded-md">
              ↑ 5%
            </span>
            <span className="text-xs text-gray-400 font-medium">
              than last month
            </span>
          </div>
        </div>

        {/* Placeholder for Locale/Format dropdown like "USD" */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">
          🇺🇸 EN <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button className="flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-gray-800 transition-colors shadow-md">
          <ArrowLeftRight className="w-4 h-4" /> Transfer Member
        </button>
        <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 rounded-xl py-3.5 font-semibold text-sm hover:bg-gray-200 transition-colors">
          <UserPlus className="w-4 h-4" /> New Sign Up
        </button>
      </div>

      {/* Sub-Cards (Wallets Adaptation) */}
      <div className="mt-auto">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          Memberships{" "}
          <span className="text-gray-400 font-medium font-normal">
            | Total 3 plans
          </span>
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Box 1 */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <CreditCard className="w-4 h-4 text-gray-400" /> BASIC
              </div>
              <OptionsIcon />
            </div>
            <div className="text-lg font-bold text-gray-900">745</div>
            <div className="text-xs font-medium text-gray-400 mb-2">
              Limit is 1K a month
            </div>
            <div className="text-[10px] font-bold text-[#33D073]">Active</div>
          </div>

          {/* Box 2 */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <Star className="w-4 h-4 text-[#FF5C39]" /> PRO
              </div>
              <OptionsIcon />
            </div>
            <div className="text-lg font-bold text-gray-900">350</div>
            <div className="text-xs font-medium text-gray-400 mb-2">
              Limit is 500 a month
            </div>
            <div className="text-[10px] font-bold text-[#33D073]">Active</div>
          </div>

          {/* Box 3 */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <Droplet className="w-4 h-4 text-purple-500" /> ELITE
              </div>
              <OptionsIcon />
            </div>
            <div className="text-lg font-bold text-gray-900">150</div>
            <div className="text-xs font-medium text-gray-400 mb-2">
              Limit is 200 a month
            </div>
            <div className="text-[10px] font-bold text-[#FF5C39]">Limited</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400 hover:text-gray-900 transition-colors"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

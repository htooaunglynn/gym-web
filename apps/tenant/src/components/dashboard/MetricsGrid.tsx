import { Briefcase, Database, Zap, CreditCard } from "lucide-react";

export function MetricsGrid({
  totalTrainers = 0,
  totalEquipment = 0,
  activeSubscriptionCount = 0,
  hasLowStock = false,
}: {
  totalTrainers?: number;
  totalEquipment?: number;
  activeSubscriptionCount?: number;
  hasLowStock?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Low-stock alert badge — shown above the grid when any product stock ≤ 5 */}
      {hasLowStock && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-center gap-2 bg-[#e60023]/10 border border-[#e60023]/30 text-[#e60023] rounded-2xl px-4 py-2.5 text-sm font-semibold"
        >
          <span aria-hidden="true">⚠</span>
          <span>
            Low Stock Alert — one or more products are running low (≤ 5 units)
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Box 1 (Orange) */}
        <div className="bg-[#FF5C39] text-white rounded-3xl p-6 shadow-md shadow-[#FF5C39]/20 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-medium opacity-90">
              Active Trainers
            </span>
            <Briefcase className="w-5 h-5 opacity-80" />
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">{totalTrainers}</div>
            <div className="flex items-center text-xs font-bold gap-1 mt-1 opacity-90">
              <span className="font-medium opacity-70">Employed</span>
            </div>
          </div>
        </div>

        {/* Box 2 */}
        <div className="bg-white text-gray-900 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-medium text-gray-500">
              Total Equipment
            </span>
            <Database className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">{totalEquipment}</div>
            <div className="flex items-center text-xs font-bold gap-1 mt-1 text-[#33D073]">
              <span className="text-gray-400 font-medium">Assets Tracked</span>
            </div>
          </div>
        </div>

        {/* Box 3 — Active Subscriptions (Requirement 3.3) */}
        <div className="bg-white text-gray-900 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-medium text-gray-500">
              Active Subscriptions
            </span>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">
              {activeSubscriptionCount}
            </div>
            <div className="flex items-center text-xs font-bold gap-1 mt-1">
              <span className="text-gray-400 font-medium">
                Currently Active
              </span>
            </div>
          </div>
        </div>

        {/* Box 4 */}
        <div className="bg-white text-gray-900 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-medium text-gray-500">
              Daily Check-ins
            </span>
            <Zap className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">850</div>
            <div className="flex items-center text-xs font-bold gap-1 mt-1 text-[#33D073]">
              <span className="text-gray-400 font-medium">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

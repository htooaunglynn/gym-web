import { Briefcase, Info, Database, Zap } from "lucide-react";

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Box 1 (Orange) */}
      <div className="bg-[#FF5C39] text-white rounded-3xl p-6 shadow-md shadow-[#FF5C39]/20 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <span className="text-sm font-medium opacity-90">Today's Revenue</span>
          <Briefcase className="w-5 h-5 opacity-80" />
        </div>
        <div>
          <div className="text-3xl font-bold mb-2">$950</div>
          <div className="flex items-center text-xs font-bold gap-1 mt-1 opacity-90">
            ↑ 7% <span className="font-medium opacity-70">This month</span>
          </div>
        </div>
      </div>

      {/* Box 2 */}
      <div className="bg-white text-gray-900 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <span className="text-sm font-medium text-gray-500">Expiring Plans</span>
          <Info className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <div className="text-3xl font-bold mb-2">42</div>
          <div className="flex items-center text-xs font-bold gap-1 mt-1 text-red-500">
            ↓ 5% <span className="text-gray-400 font-medium">This month</span>
          </div>
        </div>
      </div>

      {/* Box 3 */}
      <div className="bg-white text-gray-900 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <span className="text-sm font-medium text-gray-500">New Sign-ups</span>
          <Database className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <div className="text-3xl font-bold mb-2">105</div>
          <div className="flex items-center text-xs font-bold gap-1 mt-1 text-[#33D073]">
            ↑ 8% <span className="text-gray-400 font-medium">This month</span>
          </div>
        </div>
      </div>

      {/* Box 4 */}
      <div className="bg-white text-gray-900 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <span className="text-sm font-medium text-gray-500">Daily Check-ins</span>
          <Zap className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <div className="text-3xl font-bold mb-2">850</div>
          <div className="flex items-center text-xs font-bold gap-1 mt-1 text-[#33D073]">
            ↑ 4% <span className="text-gray-400 font-medium">This month</span>
          </div>
        </div>
      </div>
    </div>
  );
}

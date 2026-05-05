import { Sun, Moon } from "lucide-react";

export function OverviewHeader() {
  return (
    <div className="flex items-start gap-6 mt-2 mb-8">
      {/* Theme Toggle (Based on the left floating buttons in design) */}
      <div className="flex flex-col gap-2 mt-2">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 border border-transparent hover:border-gray-200 transition-colors">
          <Sun className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 border border-transparent hover:border-gray-200 transition-colors">
          <Moon className="w-5 h-5" />
        </button>
      </div>

      {/* Main Title Area */}
      <div>
        <h1 className="text-[40px] font-bold text-gray-900 tracking-tight leading-tight mb-2">
          Good morning, Admin
        </h1>
        <p className="text-gray-500 font-medium text-base">
          Stay on top of your gym management tasks, monitor active members, and track operations.
        </p>
      </div>
    </div>
  );
}

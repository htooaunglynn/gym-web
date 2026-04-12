import { OverviewHeader } from "@/components/dashboard/OverviewHeader";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CapacityWidget } from "@/components/dashboard/CapacityWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";

export default function DashboardPage() {
  return (
    <div className="animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <OverviewHeader />
      
      {/* 
        Grid Layout replicating the Finexy design dimensions.
        Top row is roughly 3 columns.
        Bottom row is [1 column] (stack of spending + cards) and [2 columns] (table).
      */}
      <div className="flex flex-col gap-6">
        
        {/* Top Data Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StatsOverview />
          </div>
          <div className="lg:col-span-1">
            <MetricsGrid />
          </div>
          <div className="lg:col-span-1">
            <AttendanceChart />
          </div>
        </div>

        {/* Bottom Data Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 flex flex-col h-full">
            <CapacityWidget />
            <QuickActionsWidget />
          </div>
          <div className="xl:col-span-2">
            <RecentActivityTable />
          </div>
        </div>

      </div>
    </div>
  );
}

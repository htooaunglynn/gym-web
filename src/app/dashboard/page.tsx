"use client";

import { useEffect, useState } from "react";
import { OverviewHeader } from "@/components/dashboard/OverviewHeader";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CapacityWidget } from "@/components/dashboard/CapacityWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalMembers: 0,
    totalTrainers: 0,
    totalEquipment: 0,
    recentMovements: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { "Authorization": `Bearer ${token}` };

        // We fetch the 4 core entities in parallel to hydrate the dashboard cards
        const endpoints = [
          "http://localhost:3000/api/v1/members?limit=1",
          "http://localhost:3000/api/v1/trainers?limit=1",
          "http://localhost:3000/api/v1/equipment?limit=1",
          "http://localhost:3000/api/v1/inventory-movements?limit=5"
        ];

        const responses = await Promise.all(
          endpoints.map(ep => fetch(ep, { headers }))
        );

        // Catch Authentication expiry across the board
        if (responses.some(r => r.status === 401 || r.status === 403)) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return;
        }

        const data = await Promise.all(responses.map(r => r.json().catch(() => ({}))));
        
        // Extract totals assuming NestJS standard { meta: { totalItems } } or generic pagination object
        const extractTotal = (resData: any) => {
          if (resData?.meta?.totalItems !== undefined) return resData.meta.totalItems;
          if (resData?.total !== undefined) return resData.total;
          if (Array.isArray(resData?.data)) return resData.data.length;
          if (Array.isArray(resData)) return resData.length;
          return 0;
        };

        const extractArray = (resData: any) => {
          if (Array.isArray(resData?.data)) return resData.data;
          if (Array.isArray(resData)) return resData;
          return [];
        };

        setMetrics({
          totalMembers: extractTotal(data[0]),
          totalTrainers: extractTotal(data[1]),
          totalEquipment: extractTotal(data[2]),
          recentMovements: extractArray(data[3]).slice(0, 5)
        });
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className={`animate-in fade-in duration-500 max-w-[1600px] mx-auto ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <OverviewHeader />
      
      <div className="flex flex-col gap-6">
        {/* Top Data Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StatsOverview totalMembers={metrics.totalMembers} />
          </div>
          <div className="lg:col-span-1">
            <MetricsGrid 
              totalTrainers={metrics.totalTrainers} 
              totalEquipment={metrics.totalEquipment} 
            />
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
            <RecentActivityTable activities={metrics.recentMovements} />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { PlanModal } from "@/components/dashboard/PlanModal";
import { Plus } from "lucide-react";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  billingCycle: string;
  isActive: boolean;
  createdAt: string;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | undefined>(undefined);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:3000/api/v1/membership-plans?page=1&limit=50&includeDeleted=false", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setPlans(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (plan: MembershipPlan) => {
    if (!confirm(`Are you sure you want to delete "${plan.name}"?`)) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:3000/api/v1/membership-plans/${plan.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchPlans();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete plan");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting");
    }
  };

  const columns: ColumnDef<MembershipPlan>[] = [
    {
      header: "Plan Name",
      className: "min-w-[200px]",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-bold">{row.name}</span>
          <span className="text-gray-400 text-xs font-medium truncate max-w-[180px]">{row.description}</span>
        </div>
      )
    },
    {
      header: "Amount",
      className: "w-[120px]",
      accessor: (row) => (
        <span className="text-gray-900 font-bold font-mono">
          ${parseFloat(row.amount.toString()).toFixed(2)}
        </span>
      )
    },
    {
      header: "Billing Cycle",
      className: "w-[140px]",
      accessor: (row) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {row.billingCycle}
        </span>
      )
    },
    {
      header: "Status",
      className: "w-[100px]",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${row.isActive ? 'bg-[#33D073]' : 'bg-gray-300'}`} />
          <span className={`text-[11px] font-bold uppercase ${row.isActive ? 'text-[#33D073]' : 'text-gray-400'}`}>
            {row.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-tight">Membership Plans</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your gym's subscription tiers and pricing structure.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedPlan(undefined);
            setIsModalOpen(true);
          }}
          className="bg-[#E84C4C] hover:bg-[#d43f3f] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#E84C4C]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Plan
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={plans} 
        isLoading={isLoading}
        actions={[
          { 
            label: "Edit Plan", 
            onClick: (row) => {
              setSelectedPlan(row);
              setIsModalOpen(true);
            } 
          },
          { 
            label: "Delete", 
            onClick: handleDelete,
            className: "text-red-500"
          },
        ]}
      />

      <PlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPlans}
        plan={selectedPlan}
      />
    </div>
  );
}

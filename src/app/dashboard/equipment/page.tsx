"use client";

import { useEffect, useState } from "react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { AddEquipmentModal } from "@/components/crud/AddEquipmentModal";

interface Equipment {
  id: string;
  name: string;
  description: string;
  quantity: number;
  condition: "GOOD" | "FAIR" | "POOR" | "BROKEN";
  createdAt: string;
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Equipment");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:3000/api/v1/equipment?page=1&limit=50&includeDeleted=false", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Equipment API Error Response:", errData);
        throw new Error(errData.message || "Failed to fetch equipment");
      }
      
      const data = await res.json();
      setEquipment(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
      setEquipment([
        { id: "e_1", name: "Lat Pulldown Machine", description: "Primary back exercise machine", quantity: 2, condition: "GOOD", createdAt: new Date().toISOString() },
        { id: "e_2", name: "Dumbbell Set 5-50lbs", description: "Free weights area", quantity: 1, condition: "FAIR", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [activeTab]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "GOOD": return "text-emerald-600 bg-emerald-50";
      case "FAIR": return "text-blue-600 bg-blue-50";
      case "POOR": return "text-yellow-600 bg-yellow-50";
      case "BROKEN": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const columns: ColumnDef<Equipment>[] = [
    {
      header: "Id",
      className: "w-[80px]",
      accessor: (row) => <span className="text-gray-500">#{row.id.slice(0, 4)}</span>
    },
    {
      header: "Name",
      className: "min-w-[200px]",
      accessor: (row) => <span className="font-bold text-gray-900">{row.name}</span>
    },
    {
      header: "Description",
      className: "min-w-[250px]",
      accessor: (row) => <span className="text-gray-500 truncate">{row.description}</span>
    },
    {
      header: "Quantity",
      className: "w-[100px] text-center",
      accessor: (row) => (
        <span className="font-mono bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-bold">
          {row.quantity}
        </span>
      )
    },
    {
      header: "Condition",
      className: "w-[120px]",
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConditionColor(row.condition)}`}>
          {row.condition}
        </span>
      )
    }
  ];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">Equipment & Assets</h1>
          <p className="text-gray-500 font-medium text-sm">Manage machines, free weights, and gym inventory states.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
        >
          + Add Equipment
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={equipment} 
        isLoading={isLoading}
        tabs={["All Equipment", "Maintenance Needed", "Broken"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={[
          { label: "Edit Details", onClick: (row) => console.log("Edit", row.id) },
          { label: "Update Condition", onClick: (row) => console.log("Condition", row.id) },
          { label: "Remove API", onClick: (row) => console.log("Delete", row.id), className: "text-[#E84C4C] hover:bg-red-50" },
        ]}
      />

      <AddEquipmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchEquipment} 
      />
    </div>
  );
}

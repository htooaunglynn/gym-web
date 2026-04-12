"use client";

import { useEffect, useState } from "react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { AddInventoryModal } from "@/components/crud/AddInventoryModal";

interface InventoryMovement {
  id: string;
  equipmentId: string;
  movementType: "INCOMING" | "OUTGOING" | "ADJUSTMENT";
  quantity: number;
  occurredAt: string;
  reason: string;
  note: string;
  createdAt: string;
}

export default function InventoryPage() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Movements");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMovements = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:3000/api/v1/inventory-movements?page=1&limit=50", {
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
        console.error("API Error Response:", errData);
        throw new Error(errData.message || "Failed to fetch inventory movements");
      }
      
      const data = await res.json();
      setMovements(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
      setMovements([
        { id: "im_1", equipmentId: "e_1", movementType: "INCOMING", quantity: 5, occurredAt: new Date().toISOString(), reason: "Restock", note: "Supplier dropship", createdAt: new Date().toISOString() },
        { id: "im_2", equipmentId: "e_2", movementType: "OUTGOING", quantity: 1, occurredAt: new Date().toISOString(), reason: "Session Use", note: "", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [activeTab]);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "INCOMING": return "text-emerald-600 bg-emerald-50 border border-emerald-100";
      case "OUTGOING": return "text-indigo-600 bg-indigo-50 border border-indigo-100";
      case "ADJUSTMENT": return "text-amber-600 bg-amber-50 border border-amber-100";
      default: return "text-gray-600 bg-gray-50 border border-gray-200";
    }
  };

  const columns: ColumnDef<InventoryMovement>[] = [
    {
      header: "Date Time",
      className: "min-w-[160px]",
      accessor: (row) => (
        <span className="text-gray-500 font-medium">
          {new Date(row.occurredAt).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
          })}
        </span>
      )
    },
    {
      header: "Type",
      className: "w-[130px]",
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${getTypeStyle(row.movementType)}`}>
          {row.movementType}
        </span>
      )
    },
    {
      header: "Equipment ID",
      className: "w-[120px]",
      accessor: (row) => <span className="font-mono text-gray-500">{row.equipmentId.slice(0, 8)}</span>
    },
    {
      header: "Qty",
      className: "w-[80px]",
      accessor: (row) => (
         <span className={`font-mono font-bold ${row.movementType === 'OUTGOING' ? 'text-red-500' : 'text-emerald-500'}`}>
           {row.movementType === 'OUTGOING' ? '-' : row.movementType === 'INCOMING' ? '+' : '='}{row.quantity}
         </span>
      )
    },
    {
      header: "Reason",
      className: "min-w-[200px]",
      accessor: (row) => <span className="text-gray-900 font-semibold">{row.reason}</span>
    }
  ];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">Inventory Logs</h1>
          <p className="text-gray-500 font-medium text-sm">Track equipment additions, deployments, and audit cycle counts.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
        >
          Add Movement
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={movements} 
        isLoading={isLoading}
        tabs={["All Actions", "Incoming", "Outgoing"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={[
          { label: "View Details", onClick: (row) => console.log("Edit", row.id) },
        ]}
      />

      <AddInventoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchMovements} 
      />
    </div>
  );
}

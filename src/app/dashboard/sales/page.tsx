"use client";

import { useEffect, useState } from "react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { SaleModal } from "@/components/dashboard/SaleModal";
import { Plus, ShoppingBag, User, Calendar } from "lucide-react";

interface Sale {
  id: string;
  memberId: string | null;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  occurredAt: string;
  member?: {
    firstName: string;
    lastName: string;
  };
  items: any[];
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>(undefined);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:3000/api/v1/product-sales?page=1&limit=50&includeDeleted=false", {
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
      setSales(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch sales", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const columns: ColumnDef<Sale>[] = [
    {
      header: "Transaction",
      className: "min-w-[180px]",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-bold">#{row.id.slice(0, 8).toUpperCase()}</span>
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
               <Calendar className="w-3 h-3" />
               {new Date(row.occurredAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Customer",
      className: "min-w-[200px]",
      accessor: (row) => (
        <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
                {row.member ? `${row.member.firstName} ${row.member.lastName}` : "Guest Customer"}
            </span>
        </div>
      )
    },
    {
      header: "Amount",
      className: "w-[120px]",
      accessor: (row) => (
        <span className="text-gray-900 font-bold font-mono">
          ${parseFloat(row.totalAmount.toString()).toFixed(2)}
        </span>
      )
    },
    {
       header: "Payment",
       className: "w-[150px]",
       accessor: (row) => (
         <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${row.paymentStatus === 'PAID' ? 'bg-[#33D073]' : 'bg-amber-400'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${row.paymentStatus === 'PAID' ? 'text-[#33D073]' : 'text-amber-500'}`}>
                    {row.paymentStatus}
                </span>
            </div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">via {row.paymentMethod?.replace('_', ' ') || 'CASH'}</span>
         </div>
       )
    }
  ];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-tight text-gray-900">Sales History</h1>
          <p className="text-gray-500 font-medium text-sm">Review transactions and track your gym's retail performance.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedSale(undefined);
            setIsModalOpen(true);
          }}
          className="bg-[#FF5C39] hover:bg-[#e64a2e] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#FF5C39]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Sale
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={sales} 
        isLoading={isLoading}
        actions={[
          { 
            label: "View Details", 
            onClick: (row) => {
              setSelectedSale(row);
              setIsModalOpen(true);
            } 
          }
        ]}
      />

      <SaleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchSales}
        sale={selectedSale}
      />
    </div>
  );
}

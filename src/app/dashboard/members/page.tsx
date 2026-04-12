"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { AddMemberModal } from "@/components/crud/AddMemberModal";

interface Member {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  trainerId: string | null;
  createdAt: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Members");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      // We default to page=1, limit=50 for now
      const res = await fetch("http://localhost:3000/api/v1/members?page=1&limit=50&includeDeleted=false", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      console.log("Response Status:", res.status);
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Members API Error Response:", errData);
        throw new Error(errData.message || "Failed to fetch members");
      }
      
      const data = await res.json();
      // Assume API returns { data: [...], total, page, limit } based on generic NestJS pagination
      // If it just returns an array, we handle it:
      setMembers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
      // Fallback dummy data solely for visual testing if API fails
      setMembers([
        { id: "cm_2632", firstName: "Brooklyn", lastName: "Zoe", phone: "+1 (555) 123", email: "bzoe@ex.com", trainerId: null, createdAt: new Date().toISOString() },
        { id: "cm_2633", firstName: "Alice", lastName: "Krejcova", phone: "+1 (555) 555", email: "alice@ex.com", trainerId: "t_1", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [activeTab]); // Refetch when tab changes if needed

  // Define Columns array mapping to mockup UI
  const columns: ColumnDef<Member>[] = [
    {
      header: "Id",
      className: "w-[80px]",
      accessor: (row) => <span className="text-gray-500">#{row.id.slice(0, 4)}</span>
    },
    {
      header: "Name",
      className: "min-w-[150px]",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative shadow-sm">
            <Image 
              src={`https://ui-avatars.com/api/?name=${row.firstName}+${row.lastName}&background=random`}
              alt="Avatar"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="font-bold">{row.firstName} {row.lastName}</span>
        </div>
      )
    },
    {
      header: "Trainer Status",
      className: "w-[120px]",
      accessor: (row) => (
        <span className="text-gray-600 font-semibold">
          {row.trainerId ? "Has Trainer" : "Independent"}
        </span>
      )
    },
    {
      header: "Phone",
      className: "w-[160px]",
      accessor: (row) => (
         <div className="flex items-center gap-1.5 text-gray-500 font-medium">
           <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> 
           {row.phone}
         </div>
      )
    },
    {
      header: "Email",
      accessor: "email",
      // Match the red 'Type' text from the design if you want
      className: "text-[#E84C4C] min-w-[200px]" 
    },
    {
      header: "Status",
      className: "w-[140px]",
      accessor: () => (
        <div className="flex items-center gap-1.5 font-bold text-gray-900">
          <span className="w-2 h-2 rounded-full bg-[#FF9500] shadow-[0_0_8px_#FF9500] animate-pulse" />
          Active
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">Members</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your gym members, assign trainers, and track their information.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
        >
          + Add Member
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={members} 
        isLoading={isLoading}
        tabs={["All Members", "With Trainers", "Independent"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={[
          { label: "Edit Details", onClick: (row) => console.log("Edit", row.id) },
          { label: "Assign Trainer", onClick: (row) => console.log("Assign", row.id) },
          { label: "Remove", onClick: (row) => console.log("Delete", row.id), className: "text-[#E84C4C] hover:bg-red-50" },
        ]}
      />

      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchMembers} 
      />
    </div>
  );
}

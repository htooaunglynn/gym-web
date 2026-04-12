"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { AddUserModal } from "@/components/crud/AddUserModal";

interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Users");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:3000/api/v1/users?page=1&limit=50&includeDeleted=false", {
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
        console.error("Users API Error Response:", errData);
        throw new Error(errData.message || "Failed to fetch users");
      }
      
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error(error);
      setUsers([
        { id: "u_1", firstName: "Admin", lastName: "User", phone: "+1 (555) 000", email: "admin@gym.local", role: "ADMIN", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const columns: ColumnDef<User>[] = [
    {
      header: "Id",
      className: "w-[80px]",
      accessor: (row) => <span className="text-gray-500">#{row.id.slice(0, 4)}</span>
    },
    {
      header: "User Name",
      className: "min-w-[200px]",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative shadow-sm ring-2 ring-gray-100">
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
      header: "Role",
      className: "w-[120px]",
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-[8px] text-[11px] font-bold uppercase tracking-wider ${row.role === 'ADMIN' ? 'bg-[#FF5C39]/10 text-[#E84C4C] border border-[#FF5C39]/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
          {row.role}
        </span>
      )
    },
    {
      header: "Phone",
      className: "w-[160px]",
      accessor: (row) => (
         <div className="flex items-center gap-1.5 text-gray-500 font-medium">
           {row.phone}
         </div>
      )
    },
    {
      header: "Email",
      accessor: "email",
      className: "text-[#E84C4C] min-w-[200px]" 
    }
  ];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">System Users</h1>
          <p className="text-gray-500 font-medium text-sm">Manage staff and administrative access to the platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
        >
          + Add User
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={users} 
        isLoading={isLoading}
        tabs={["All Users", "Admins Only", "Staff Only"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={[
          { label: "Change Role", onClick: (row) => console.log("Edit", row.id) },
          { label: "Revoke Access", onClick: (row) => console.log("Delete", row.id), className: "text-[#E84C4C] hover:bg-red-50" },
        ]}
      />

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchUsers} 
      />
    </div>
  );
}

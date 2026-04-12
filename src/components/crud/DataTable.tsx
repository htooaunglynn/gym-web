"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

export type ColumnDef<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string; // Optional specific width limits
};

type ActionDef<T> = {
  label: string;
  onClick: (row: T) => void;
  className?: string; // Optional custom color like text-red-500
};

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  actions?: ActionDef<T>[];
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({ 
  columns, 
  data, 
  actions,
  tabs = [],
  activeTab,
  onTabChange,
  isLoading
}: DataTableProps<T>) {

  // Dynamic grid template based on column count + 1 for actions
  const gridTemplateColumns = `repeat(${columns.length}, minmax(0, 1fr)) ${actions && actions.length > 0 ? "60px" : ""}`;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Header Row with Tabs and Date Picker (Static Placeholder) */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        {tabs.length > 0 && (
          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange?.(tab)}
                className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab 
                    ? "border-[#E84C4C] text-[#E84C4C]" 
                    : "border-transparent text-gray-400 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 w-full overflow-x-auto pb-8">
        <div className="min-w-[800px]">
          {/* Table Headers */}
          <div 
            className="grid px-6 py-3 mb-2 text-xs font-bold text-gray-900"
            style={{ gridTemplateColumns }}
          >
            {columns.map((col, i) => (
              <div key={i} className={col.className}>{col.header}</div>
            ))}
            {actions && actions.length > 0 && <div className="text-center text-gray-900">Action</div>}
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="w-full py-12 flex justify-center text-gray-400 font-medium">Loading data...</div>
          ) : data.length === 0 ? (
            <div className="w-full py-12 flex justify-center text-gray-400 font-medium">No results found.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.map((row) => (
                <div 
                  key={row.id} 
                  className="grid items-center px-6 py-4 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)] transition-shadow"
                  style={{ gridTemplateColumns }}
                >
                  {columns.map((col, i) => (
                    <div key={i} className={`text-sm font-semibold text-gray-900 flex items-center ${col.className || ""}`}>
                      {typeof col.accessor === "function" 
                          ? col.accessor(row) 
                          : String(row[col.accessor] ?? "")}
                    </div>
                  ))}
                  
                  {/* Action Menu */}
                  {actions && actions.length > 0 && (
                    <div className="flex justify-center">
                      <ActionPopover row={row} actions={actions} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Internal component for the floating popup menu
function ActionPopover<T>({ row, actions }: { row: T, actions: ActionDef<T>[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button 
        ref={triggerRef}
        onClick={() => setOpen(!open)} 
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-full top-0 mr-2 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl py-2 w-32 z-50 animate-in fade-in zoom-in-95 duration-200">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                setOpen(false);
                action.onClick(row);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors ${action.className || "text-gray-900"}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

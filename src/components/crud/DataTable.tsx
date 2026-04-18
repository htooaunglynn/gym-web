"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, ChevronUp, ChevronDown } from "lucide-react";
import { SkeletonTable } from "@/components/shared/SkeletonRow";

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
    /** When true, column headers become clickable sort toggles */
    sortable?: boolean;
    /** Called with (sortBy, sortOrder) when a column header is clicked and sortable=true */
    onSort?: (sortBy: string, sortOrder: "asc" | "desc") => void;
    /** When provided, renders a debounced (300ms) search input above the table */
    onSearch?: (query: string) => void;
    /** Custom node rendered instead of the default "No results found." when data is empty */
    emptyState?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    actions,
    tabs = [],
    activeTab,
    onTabChange,
    isLoading,
    sortable = false,
    onSort,
    onSearch,
    emptyState,
}: DataTableProps<T>) {
    const [sortBy, setSortBy] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounce search input by 300ms
    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearchQuery(value);
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            onSearch?.(value);
        }, 300);
    }

    // Clean up debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    function handleColumnClick(col: ColumnDef<T>) {
        if (!sortable) return;
        const key =
            typeof col.accessor === "function" ? col.header : String(col.accessor);
        let newOrder: "asc" | "desc" = "asc";
        if (sortBy === key) {
            newOrder = sortOrder === "asc" ? "desc" : "asc";
        }
        setSortBy(key);
        setSortOrder(newOrder);
        onSort?.(key, newOrder);
    }

    // Dynamic grid template based on column count + 1 for actions
    const gridTemplateColumns = `repeat(${columns.length}, minmax(0, 1fr)) ${actions && actions.length > 0 ? "60px" : ""}`;

    return (
        <div className="w-full h-full flex flex-col">
            {/* Top Header Row with Tabs, Search, and Date Picker */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                {tabs.length > 0 && (
                    <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-[#f3f2ee] p-1 min-w-max">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange?.(tab)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab
                                            ? "bg-white text-[#211922] shadow-sm"
                                            : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search input — only rendered when onSearch prop is provided */}
                {onSearch && (
                    <div className="flex items-center w-full lg:w-auto">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            aria-label="Search"
                            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e60023]/20 focus:border-[#e60023] transition-colors w-full lg:w-64"
                        />
                    </div>
                )}
            </div>

            <div className="flex-1 w-full overflow-x-auto pb-6">
                <div className="min-w-[780px] bg-white border border-[#eceae3] rounded-2xl overflow-hidden">
                    {/* Table Headers */}
                    <div
                        className="grid px-6 py-3 text-xs font-bold text-gray-700 bg-[#fbfaf8] border-b border-[#eceae3]"
                        style={{ gridTemplateColumns }}
                    >
                        {columns.map((col, i) => {
                            const key =
                                typeof col.accessor === "function"
                                    ? col.header
                                    : String(col.accessor);
                            const isActive = sortBy === key;

                            return sortable ? (
                                <button
                                    key={i}
                                    onClick={() => handleColumnClick(col)}
                                    className={`flex items-center gap-1 text-left text-xs font-bold transition-colors hover:text-[#E84C4C] ${col.className || ""} ${isActive ? "text-[#E84C4C]" : "text-gray-900"}`}
                                >
                                    {col.header}
                                    <span className="flex flex-col leading-none">
                                        <ChevronUp
                                            className={`w-3 h-3 -mb-0.5 ${isActive && sortOrder === "asc" ? "opacity-100" : "opacity-30"}`}
                                        />
                                        <ChevronDown
                                            className={`w-3 h-3 ${isActive && sortOrder === "desc" ? "opacity-100" : "opacity-30"}`}
                                        />
                                    </span>
                                </button>
                            ) : (
                                <div key={i} className={col.className}>
                                    {col.header}
                                </div>
                            );
                        })}
                        {actions && actions.length > 0 && (
                            <div className="text-center text-gray-900">Action</div>
                        )}
                    </div>

                    {/* Table Body */}
                    {isLoading ? (
                        <div className="px-2 py-3">
                            <SkeletonTable
                                columns={columns.length}
                                hasActions={!!actions?.length}
                            />
                        </div>
                    ) : data.length === 0 ? (
                        <div className="w-full py-16 flex justify-center text-gray-400 font-medium">
                            {emptyState ?? "No results found."}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {data.map((row) => (
                                <div
                                    key={row.id}
                                    className="grid items-center px-6 py-4 border-b border-[#f1f0eb] last:border-b-0 hover:bg-[#fcfcfa] transition-colors"
                                    style={{ gridTemplateColumns }}
                                >
                                    {columns.map((col, i) => (
                                        <div
                                            key={i}
                                            className={`text-sm font-semibold text-gray-900 flex items-center ${col.className || ""}`}
                                        >
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
function ActionPopover<T>({
    row,
    actions,
}: {
    row: T;
    actions: ActionDef<T>[];
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-10 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl py-2 w-40 z-50 animate-in fade-in zoom-in-95 duration-200"
                >
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            role="menuitem"
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

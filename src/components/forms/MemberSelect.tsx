"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Check } from "lucide-react";
import { apiClient, PaginationResponse } from "@/lib/apiClient";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface MemberSelectProps {
  onSelect: (member: Member | null) => void;
  selectedMemberId?: string;
  label?: string;
}

export function MemberSelect({
  onSelect,
  selectedMemberId,
  label = "Search Member",
}: MemberSelectProps) {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all members once when the dropdown opens
  const fetchMembers = async () => {
    if (allMembers.length > 0) return; // already loaded
    setIsLoading(true);
    try {
      const res = await apiClient<PaginationResponse<Member>>("/members", {
        params: { page: 1, limit: 50, isActive: true },
      });
      const list = Array.isArray(res) ? res : (res.data ?? []);
      setAllMembers(list);
      setMembers(list);
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsLoading(false);
    }
  };

  // Filter client-side whenever the search query changes
  useEffect(() => {
    if (!isOpen) return;
    if (!query.trim()) {
      setMembers(allMembers);
      return;
    }
    const lower = query.toLowerCase();
    setMembers(
      allMembers.filter(
        (m) =>
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(lower) ||
          m.email?.toLowerCase().includes(lower),
      ),
    );
  }, [query, allMembers, isOpen]);

  // Open → fetch
  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedMember = allMembers.find((m) => m.id === selectedMemberId);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
        {label}
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-900 cursor-pointer transition-colors bg-white"
      >
        <Search className="w-4 h-4 text-gray-400" />
        {selectedMember ? (
          <div className="flex-1 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {selectedMember.firstName} {selectedMember.lastName}
              </span>
              <span className="text-[10px] text-gray-400">
                {selectedMember.email}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500"
              aria-label="Clear member selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-400 font-medium">
            Select a member (optional)
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 max-h-[300px] overflow-y-auto flex flex-col p-2 animate-in fade-in slide-in-from-top-2">
          <input
            autoFocus
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border-b border-gray-50 focus:outline-none text-sm font-medium mb-2 sticky top-0 bg-white"
          />

          {isLoading && (
            <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
              Searching...
            </div>
          )}

          {!isLoading && members.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-400">
              No members found
            </div>
          )}

          {members.map((member) => (
            <div
              key={member.id}
              onClick={() => {
                onSelect(member);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                selectedMemberId === member.id
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  selectedMemberId === member.id
                    ? "bg-white/20"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {member.firstName[0]}
                {member.lastName[0]}
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">
                  {member.firstName} {member.lastName}
                </span>
                <span
                  className={`text-[10px] truncate ${
                    selectedMemberId === member.id
                      ? "text-white/60"
                      : "text-gray-400"
                  }`}
                >
                  {member.email || "No email"}
                </span>
              </div>
              {selectedMemberId === member.id && (
                <Check className="w-4 h-4 text-white shrink-0" />
              )}
            </div>
          ))}

          <div
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
            className="mt-2 pt-2 border-t border-gray-50 p-3 rounded-xl cursor-pointer hover:bg-gray-50 text-gray-400 text-xs font-bold text-center uppercase tracking-wider"
          >
            Guest Sale (No Member)
          </div>
        </div>
      )}
    </div>
  );
}

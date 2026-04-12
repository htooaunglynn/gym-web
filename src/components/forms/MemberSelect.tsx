"use client";

import { useState, useEffect, useRef } from "react";
import { Search, User, X, Check } from "lucide-react";

interface MemberSelectProps {
  onSelect: (member: any) => void;
  selectedMemberId?: string;
  label?: string;
}

export function MemberSelect({ onSelect, selectedMemberId, label = "Search Member" }: MemberSelectProps) {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchMembers = async (search: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      // Note: Backend might not support 'search' param yet, so we'll just fetch active members
      const res = await fetch(`http://localhost:3000/api/v1/members?page=1&limit=50&isActive=true`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data || [];
      
      if (search) {
        setMembers(list.filter((m: any) => 
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          m.email?.toLowerCase().includes(search.toLowerCase())
        ));
      } else {
        setMembers(list);
      }
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => fetchMembers(query), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [query, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedMember = members.find(m => m.id === selectedMemberId);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-900 cursor-pointer transition-colors bg-white"
      >
        <Search className="w-4 h-4 text-gray-400" />
        {selectedMember ? (
          <div className="flex-1 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{selectedMember.firstName} {selectedMember.lastName}</span>
              <span className="text-[10px] text-gray-400">{selectedMember.email}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-400 font-medium">Select a member (optional)</span>
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
          
          {isLoading && <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">Searching...</div>}
          
          {!isLoading && members.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-400">No members found</div>
          )}

          {members.map((member) => (
            <div 
              key={member.id}
              onClick={() => {
                onSelect(member);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                selectedMemberId === member.id ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selectedMemberId === member.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
              }`}>
                {member.firstName[0]}{member.lastName[0]}
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">{member.firstName} {member.lastName}</span>
                <span className={`text-[10px] truncate ${selectedMemberId === member.id ? 'text-white/60' : 'text-gray-400'}`}>
                  {member.email || "No email"}
                </span>
              </div>
              {selectedMemberId === member.id && <Check className="w-4 h-4 text-white" />}
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

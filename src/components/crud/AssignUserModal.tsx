"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Search, Check } from "lucide-react";
import { apiClient, PaginationResponse } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

type BranchRole = "ADMIN" | "BRANCH_ADMIN" | "STAFF" | "HR" | "MANAGER";

export interface AssignUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  branchId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssignUserModal({
  isOpen,
  onClose,
  onSuccess,
  branchId,
}: AssignUserModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [role, setRole] = useState<BranchRole>("STAFF");
  const [loading, setLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedUser(null);
      setSearchQuery("");
      setRole("STAFF");
      setValidationError(null);
      setIsDropdownOpen(false);

      setIsFetchingUsers(true);
      apiClient<PaginationResponse<User>>("/users", {
        params: { page: 1, limit: 50, includeDeleted: false },
      })
        .then((res) => {
          setUsers(res.data);
          setFilteredUsers(res.data);
        })
        .catch(() => {
          // apiClient handles toast
        })
        .finally(() => setIsFetchingUsers(false));
    }
  }, [isOpen]);

  // Filter users client-side as the search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        ),
      );
    }
  }, [searchQuery, users]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key closes the modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedUser) {
      setValidationError("Please select a user to assign.");
      return;
    }

    setLoading(true);
    try {
      await apiClient(`/branches/${branchId}/users`, {
        method: "POST",
        body: JSON.stringify({ userId: selectedUser.id, role }),
      });

      onSuccess();
      onClose();
    } catch {
      // apiClient already shows an error toast; keep modal open
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-user-modal-title"
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl shadow-black/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2
            id="assign-user-modal-title"
            className="text-xl font-bold text-gray-900"
          >
            Assign User to Branch
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Validation error */}
          {validationError && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {validationError}
            </div>
          )}

          {/* User Select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              User *
            </label>
            <div className="relative" ref={dropdownRef}>
              {/* Trigger */}
              <div
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-900 cursor-pointer transition-colors bg-white"
              >
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                {selectedUser ? (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate">
                        {selectedUser.email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(null);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 shrink-0 ml-2"
                      aria-label="Clear selection"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 font-medium">
                    {isFetchingUsers ? "Loading users…" : "Select a user"}
                  </span>
                )}
              </div>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 max-h-[260px] overflow-y-auto flex flex-col p-2 animate-in fade-in slide-in-from-top-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by name or email…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-b border-gray-50 focus:outline-none text-sm font-medium mb-2 sticky top-0 bg-white"
                  />

                  {isFetchingUsers && (
                    <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Loading…
                    </div>
                  )}

                  {!isFetchingUsers && filteredUsers.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-400">
                      No users found
                    </div>
                  )}

                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDropdownOpen(false);
                        setSearchQuery("");
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        selectedUser?.id === user.id
                          ? "bg-gray-900 text-white"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          selectedUser?.id === user.id
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <span className="text-sm font-bold truncate">
                          {user.firstName} {user.lastName}
                        </span>
                        <span
                          className={`text-[10px] truncate ${
                            selectedUser?.id === user.id
                              ? "text-white/60"
                              : "text-gray-400"
                          }`}
                        >
                          {user.email}
                        </span>
                      </div>
                      {selectedUser?.id === user.id && (
                        <Check className="w-4 h-4 text-white shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Role Select */}
          <div>
            <label
              htmlFor="assign-user-role"
              className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
            >
              Role *
            </label>
            <select
              id="assign-user-role"
              value={role}
              onChange={(e) => setRole(e.target.value as BranchRole)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-[#435ee5]/20 transition-colors text-sm bg-white"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="BRANCH_ADMIN">BRANCH_ADMIN</option>
              <option value="STAFF">STAFF</option>
              <option value="HR">HR</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isFetchingUsers}
              className="px-6 py-2.5 bg-[#e60023] hover:bg-[#c4001f] text-white text-sm font-semibold rounded-2xl shadow-md transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e60023]"
            >
              {loading ? "Assigning…" : "Assign User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

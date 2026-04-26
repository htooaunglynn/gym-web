"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { LocationSelector } from "../shared/LocationSelector";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Branch {
  id: string;
  name: string;
  description?: string;
  city?: string;
  township?: string;
  users?: BranchUser[];
  createdAt: string;
}

export interface BranchUser {
  userId: string;
  role: string;
  user?: { firstName: string; lastName: string; email: string };
}

export interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** undefined = create mode, defined = edit mode */
  branch?: Branch;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BranchModal({
  isOpen,
  onClose,
  onSuccess,
  branch,
}: BranchModalProps) {
  const isEditMode = Boolean(branch);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [township, setTownship] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);

  // Pre-populate fields in edit mode (or reset in create mode) when modal opens
  useEffect(() => {
    if (isOpen) {
      if (branch) {
        setName(branch.name);
        setDescription(branch.description ?? "");
        setCity(branch.city ?? "");
        setTownship(branch.township ?? "");
      } else {
        setName("");
        setDescription("");
        setCity("");
        setTownship("");
      }
      setValidationError(null);
    }
  }, [isOpen, branch]);

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

    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError("Branch name is required.");
      return;
    }

    setLoading(true);
    try {
      const payload: {
        name: string;
        description?: string;
        city?: string;
        township?: string;
      } = {
        name: trimmedName,
      };
      if (description.trim()) {
        payload.description = description.trim();
      }
      if (city) payload.city = city;
      if (township) payload.township = township;

      if (isEditMode && branch) {
        await apiClient(`/branches/${branch.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiClient("/branches", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

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
        aria-labelledby="branch-modal-title"
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl shadow-black/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2
            id="branch-modal-title"
            className="text-xl font-bold text-gray-900"
          >
            {isEditMode ? "Edit Branch" : "New Branch"}
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

          {/* Name */}
          <div>
            <label
              htmlFor="branch-name"
              className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
            >
              Branch Name *
            </label>
            <input
              id="branch-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Downtown Branch"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-[#435ee5]/20 transition-colors text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="branch-description"
              className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider"
            >
              Description
            </label>
            <textarea
              id="branch-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this branch location…"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-[#435ee5]/20 transition-colors text-sm resize-none"
            />
          </div>

          <LocationSelector
            city={city}
            township={township}
            onCityChange={setCity}
            onTownshipChange={setTownship}
            className="mb-2"
          />

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
              disabled={loading}
              className="px-6 py-2.5 bg-[#e60023] hover:bg-[#c4001f] text-white text-sm font-semibold rounded-2xl shadow-md transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e60023]"
            >
              {loading
                ? isEditMode
                  ? "Saving…"
                  : "Creating…"
                : isEditMode
                  ? "Save Changes"
                  : "Create Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

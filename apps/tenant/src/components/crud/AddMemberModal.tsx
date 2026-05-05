"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import { LocationSelector } from "../shared/LocationSelector";

export interface Member {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  city?: string;
  township?: string;
  trainerId: string | null;
  createdAt: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** When provided, the modal operates in edit mode (PATCH /members/:id) */
  member?: Member;
}

export function AddMemberModal({
  isOpen,
  onClose,
  onSuccess,
  member,
}: AddMemberModalProps) {
  const isEditMode = !!member;
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    trainerId: "",
    city: "",
    township: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-populate form when editing an existing member
  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        password: "",
        trainerId: member.trainerId ?? "",
        city: member.city ?? "",
        township: member.township ?? "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        trainerId: "",
        city: "",
        township: "",
      });
    }
    setError(null);
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && member) {
        // Edit mode: PATCH /members/:id
        const payload: Record<string, string> = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          township: formData.township,
        };

        // Only send trainerId if it has a value
        if (formData.trainerId.trim() !== "") {
          payload.trainerId = formData.trainerId;
        }

        // Only send password if non-empty
        if (formData.password.trim() !== "") {
          payload.password = formData.password;
        }

        await apiClient(`/members/${member.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        showToast("Member updated successfully", "success");
      } else {
        // Create mode: POST /members
        const payload: Record<string, string> = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          city: formData.city,
          township: formData.township,
        };

        if (formData.trainerId.trim() !== "") {
          payload.trainerId = formData.trainerId;
        }

        await apiClient("/members", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast("Member created successfully", "success");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden shadow-black/10">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Member" : "Add New Member"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
            />
          </div>

          <LocationSelector
            city={formData.city}
            township={formData.township}
            onCityChange={(city) => setFormData((prev) => ({ ...prev, city }))}
            onTownshipChange={(township) =>
              setFormData((prev) => ({ ...prev, township }))
            }
            className="mb-4"
          />

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              {isEditMode
                ? "New Password (leave blank to keep current)"
                : "Password"}
            </label>
            <input
              type="password"
              name="password"
              placeholder={
                isEditMode ? "Leave blank to keep current" : "Min 8 characters"
              }
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              Trainer ID (Optional)
            </label>
            <input
              type="text"
              name="trainerId"
              value={formData.trainerId}
              onChange={handleChange}
              placeholder="UUID or blank"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
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
              className="px-6 py-2.5 bg-[#FF5C39] hover:bg-[#E84C4C] text-white text-sm font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {loading
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save Changes"
                  : "Save Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

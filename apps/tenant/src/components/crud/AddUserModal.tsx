"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "BRANCH_ADMIN" | "STAFF" | "HR" | "MANAGER";
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** When provided, the modal operates in edit mode (PATCH /users/:id) */
  user?: User;
}

export function AddUserModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: AddUserModalProps) {
  const isEditMode = !!user;
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "STAFF" as "ADMIN" | "BRANCH_ADMIN" | "STAFF" | "HR" | "MANAGER",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-populate form when editing an existing user
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        password: "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "STAFF",
        password: "",
      });
    }
    setError(null);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && user) {
        // Edit mode: PATCH /users/:id — only send changed fields (omit password if empty)
        const payload: Partial<typeof formData> = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        };
        if (formData.password) {
          payload.password = formData.password;
        }
        await apiClient(`/users/${user.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        showToast("User updated successfully", "success");
      } else {
        // Create mode: POST /users
        await apiClient("/users", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        showToast("User created successfully", "success");
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
            {isEditMode ? "Change User Role" : "Add System User"}
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

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+1 (555)"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Access Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm appearance-none bg-white font-bold"
                >
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="BRANCH_ADMIN">BRANCH_ADMIN</option>
                  <option value="HR">HR</option>
                  <option value="MANAGER">MANAGER</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              {isEditMode
                ? "New Password (leave blank to keep current)"
                : "Initial Password"}
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
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {loading
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                  ? "Save Changes"
                  : "Provide Access"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

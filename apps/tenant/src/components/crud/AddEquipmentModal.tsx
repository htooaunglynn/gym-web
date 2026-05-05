"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface Equipment {
  id: string;
  name: string;
  description: string;
  quantity: number;
  condition: "NEW" | "GOOD" | "FAIR" | "POOR" | "BROKEN";
  createdAt: string;
}

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** When provided, the modal operates in edit mode (PATCH /equipment/:id) */
  equipment?: Equipment;
}

export function AddEquipmentModal({
  isOpen,
  onClose,
  onSuccess,
  equipment,
}: AddEquipmentModalProps) {
  const isEditMode = !!equipment;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "1",
    condition: "GOOD",
  });
  const [loading, setLoading] = useState(false);

  // Populate form when editing an existing equipment item
  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        description: equipment.description,
        quantity: String(equipment.quantity),
        condition: equipment.condition,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        quantity: "1",
        condition: "GOOD",
      });
    }
  }, [equipment, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        quantity: parseInt(formData.quantity, 10),
        condition: formData.condition,
      };

      if (isEditMode) {
        await apiClient(`/equipment/${equipment.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiClient("/equipment", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (!isEditMode) {
        setFormData({
          name: "",
          description: "",
          quantity: "1",
          condition: "GOOD",
        });
      }
      onSuccess();
      onClose();
    } catch {
      // apiClient already dispatched an error toast; keep modal open
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden shadow-black/10">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Equipment" : "Add Equipment"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              Equipment Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm resize-none"
            />
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Condition
              </label>
              <div className="relative">
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm appearance-none bg-white"
                >
                  <option value="NEW">NEW</option>
                  <option value="GOOD">GOOD</option>
                  <option value="FAIR">FAIR</option>
                  <option value="POOR">POOR</option>
                  <option value="BROKEN">BROKEN</option>
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
                  : "Adding..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Equipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

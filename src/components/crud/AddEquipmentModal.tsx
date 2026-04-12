"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEquipmentModal({ isOpen, onClose, onSuccess }: AddEquipmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "1",
    condition: "GOOD"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authorization token found. Please login.");

      // Temporarily hardcode a safe createdByUserId until the team has a legit /me endpoint parsed 
      // or we extract the sub from the JWT. The API may accept undefined or fallback.
      const payload = {
        name: formData.name,
        description: formData.description,
        quantity: parseInt(formData.quantity, 10),
        condition: formData.condition,
        // The API requires these fields based on the Postman JSON
        // If the API allows them to be absent and inferred by the token, that's ideal.
        createdByUserId: "temporary-admin-id-fallback", 
        managedByUserId: "temporary-admin-id-fallback"
      };

      const res = await fetch("http://localhost:3000/api/v1/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create equipment");

      setFormData({ name: "", description: "", quantity: "1", condition: "GOOD" });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden shadow-black/10">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add Equipment</h2>
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

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Equipment Name</label>
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
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Description</label>
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
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Quantity</label>
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
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Condition</label>
              <div className="relative">
                <select 
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm appearance-none bg-white"
                >
                  <option value="GOOD">GOOD</option>
                  <option value="FAIR">FAIR</option>
                  <option value="POOR">POOR</option>
                  <option value="BROKEN">BROKEN</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
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
               {loading ? "Saving..." : "Add Equipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

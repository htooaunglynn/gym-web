"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddInventoryModal({ isOpen, onClose, onSuccess }: AddInventoryModalProps) {
  const [actionType, setActionType] = useState<"incoming" | "outgoing" | "adjustments">("incoming");
  
  const [formData, setFormData] = useState({
    equipmentId: "",
    quantity: "1",
    occurredAt: new Date().toISOString().slice(0, 16),
    reason: "",
    note: ""
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

      // Base payload
      const payload: any = {
        equipmentId: formData.equipmentId,
        occurredAt: new Date(formData.occurredAt).toISOString(),
        reason: formData.reason,
        note: formData.note
      };

      // Adjustments API specifically wants `targetQuantity` instead of `quantity`
      if (actionType === "adjustments") {
        payload.targetQuantity = parseInt(formData.quantity, 10);
      } else {
        payload.quantity = parseInt(formData.quantity, 10);
      }

      // The URL changes dynamically based on the selected actionType
      const url = `http://localhost:3000/api/v1/inventory-movements/${actionType}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to process ${actionType}`);

      setFormData({
        equipmentId: "",
        quantity: "1",
        occurredAt: new Date().toISOString().slice(0, 16),
        reason: "",
        note: ""
      });
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
          <h2 className="text-xl font-bold text-gray-900">Record Movement</h2>
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

          {/* Action Tabs Menu */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setActionType("incoming")}
              className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${actionType === "incoming" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              INCOMING
            </button>
            <button
              type="button"
              onClick={() => setActionType("outgoing")}
              className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${actionType === "outgoing" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              OUTGOING
            </button>
            <button
              type="button"
              onClick={() => setActionType("adjustments")}
              className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${actionType === "adjustments" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              ADJUST
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Equipment ID Target</label>
            <input 
              type="text" 
              name="equipmentId"
              placeholder="UUID"
              value={formData.equipmentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors font-mono text-sm"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-[0.4]">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                {actionType === "adjustments" ? "Target Qty" : "Quantity"}
              </label>
              <input 
                type="number" 
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm font-mono"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Timestamp</label>
              <input 
                type="datetime-local" 
                name="occurredAt"
                value={formData.occurredAt}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm text-gray-600"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Reason</label>
            <input 
              type="text" 
              name="reason"
              placeholder="e.g. Restock, Session Use"
              value={formData.reason}
              onChange={handleChange}
              required
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
               {loading ? "Recording..." : "Save Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

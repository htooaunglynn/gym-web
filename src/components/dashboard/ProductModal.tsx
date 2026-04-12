"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any; // If provided, we are in EDIT mode
}

export function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    unitPrice: "",
    quantity: "0",
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        description: product.description || "",
        unitPrice: product.unitPrice?.toString() || "",
        quantity: product.quantity?.toString() || "0",
        isActive: product.isActive !== undefined ? product.isActive : true
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        description: "",
        unitPrice: "",
        quantity: "0",
        isActive: true
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authorization token found. Please login.");

      const method = product ? "PATCH" : "POST";
      const url = product 
        ? `http://localhost:3000/api/v1/products/${product.id}` 
        : "http://localhost:3000/api/v1/products";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          unitPrice: parseFloat(formData.unitPrice),
          quantity: parseInt(formData.quantity)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${product ? 'update' : 'create'} product`);

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
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-gray-900">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{product ? "Edit Product" : "New Product"}</h2>
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
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Product Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="e.g. Protein Shake"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm font-semibold"
            />
          </div>

          <div className="mb-4 text-gray-900">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">SKU (Stock Keeping Unit)</label>
            <input 
              type="text" 
              name="sku"
              placeholder="e.g. SHAKE-001"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm font-mono"
            />
          </div>

          <div className="mb-4 text-gray-900">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea 
              name="description"
              placeholder="Brief details about the product..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Price ($)</label>
              <input 
                type="number" 
                name="unitPrice"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.unitPrice}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm font-mono"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Stock Qty</label>
              <input 
                type="number" 
                name="quantity"
                min="0"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8 text-gray-900">
            <input 
              type="checkbox" 
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 accent-gray-900"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Product is active and for sale
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 text-gray-900">
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
               {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

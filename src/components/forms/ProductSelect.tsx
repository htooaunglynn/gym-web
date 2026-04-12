"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Package, X, Check, ShoppingCart } from "lucide-react";

interface ProductSelectProps {
  onSelect: (product: any) => void;
  label?: string;
}

export function ProductSelect({ onSelect, label = "Add Product to Cart" }: ProductSelectProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async (search: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      // Only fetch active products with stock
      const res = await fetch(`http://localhost:3000/api/v1/products?page=1&limit=50&isActive=true&onlyActive=true`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data || [];
      
      if (search) {
        setProducts(list.filter((p: any) => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku?.toLowerCase().includes(search.toLowerCase())
        ));
      } else {
        setProducts(list);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => fetchProducts(query), 300);
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-900 cursor-pointer transition-all bg-gray-50/50 hover:bg-white"
      >
        <ShoppingCart className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500 font-bold">Find product to add...</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 max-h-[400px] overflow-y-auto flex flex-col p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 sticky top-0 bg-white z-10">
            <input 
              autoFocus
              type="text"
              placeholder="Search by name or SKU..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-100 focus:border-gray-900 focus:outline-none text-sm font-semibold bg-gray-50 flex items-center"
            />
          </div>
          
          {isLoading && <div className="p-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Scanning Catalog...</div>}
          
          {!isLoading && products.length === 0 && (
            <div className="p-8 text-center flex flex-col items-center gap-2">
              <Package className="w-8 h-8 text-gray-200" />
              <span className="text-xs text-gray-400 font-medium font-bold">No products found</span>
            </div>
          )}

          {products.map((product) => (
            <div 
              key={product.id}
              onClick={() => {
                onSelect(product);
                setIsOpen(false);
              }}
              className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all hover:bg-gray-50 group border border-transparent hover:border-gray-100 mb-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-gray-900 transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-gray-900 truncate">{product.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{product.sku || "NO SKU"}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className={`text-[10px] font-bold ${product.quantity <= 5 ? 'text-red-500' : 'text-[#33D073]'}`}>
                    {product.quantity} in stock
                  </span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900">${parseFloat(product.unitPrice).toFixed(2)}</span>
                <span className="text-[9px] font-bold text-gray-300 uppercase">Per Unit</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

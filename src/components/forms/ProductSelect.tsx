"use client";

import { useState, useEffect, useRef } from "react";
import { Package, ShoppingCart } from "lucide-react";
import { apiClient, PaginationResponse } from "@/lib/apiClient";

interface Product {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: string | number;
}

interface ProductSelectProps {
  onSelect: (product: Product) => void;
  label?: string;
}

export function ProductSelect({
  onSelect,
  label = "Add Product to Cart",
}: ProductSelectProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all active products once when the dropdown opens
  const fetchProducts = async () => {
    if (allProducts.length > 0) return; // already loaded
    setIsLoading(true);
    try {
      const res = await apiClient<PaginationResponse<Product>>("/products", {
        params: { page: 1, limit: 50, isActive: true, onlyActive: true },
      });
      const list = Array.isArray(res) ? res : (res.data ?? []);
      setAllProducts(list);
      setProducts(list);
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsLoading(false);
    }
  };

  // Filter client-side whenever the search query changes
  useEffect(() => {
    if (!isOpen) return;
    if (!query.trim()) {
      setProducts(allProducts);
      return;
    }
    const lower = query.toLowerCase();
    setProducts(
      allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.sku?.toLowerCase().includes(lower),
      ),
    );
  }, [query, allProducts, isOpen]);

  // Open → fetch
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
        {label}
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-900 cursor-pointer transition-all bg-gray-50/50 hover:bg-white"
      >
        <ShoppingCart className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500 font-bold">
          Find product to add...
        </span>
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

          {isLoading && (
            <div className="p-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">
              Scanning Catalog...
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="p-8 text-center flex flex-col items-center gap-2">
              <Package className="w-8 h-8 text-gray-200" />
              <span className="text-xs text-gray-400 font-medium font-bold">
                No products found
              </span>
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
                <span className="text-sm font-bold text-gray-900 truncate">
                  {product.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                    {product.sku || "NO SKU"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-200" />
                  <span
                    className={`text-[10px] font-bold ${
                      product.quantity <= 5 ? "text-red-500" : "text-[#33D073]"
                    }`}
                  >
                    {product.quantity} in stock
                  </span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900">
                  ${parseFloat(String(product.unitPrice)).toFixed(2)}
                </span>
                <span className="text-[9px] font-bold text-gray-300 uppercase">
                  Per Unit
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

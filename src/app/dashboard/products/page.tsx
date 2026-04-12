"use client";

import { useEffect, useState } from "react";
import { DataTable, ColumnDef } from "@/components/crud/DataTable";
import { ProductModal } from "@/components/dashboard/ProductModal";
import { Plus, Package, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  unitPrice: number;
  quantity: number;
  isActive: boolean;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:3000/api/v1/products?page=1&limit=50&includeDeleted=false", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:3000/api/v1/products/${product.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting");
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      header: "Product Info",
      className: "min-w-[250px]",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            <Package className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-bold">{row.name}</span>
            <span className="text-gray-400 text-xs font-mono uppercase tracking-tighter">{row.sku || "NO SKU"}</span>
          </div>
        </div>
      )
    },
    {
      header: "Price",
      className: "w-[120px]",
      accessor: (row) => (
        <span className="text-gray-900 font-bold font-mono">
          ${parseFloat(row.unitPrice.toString()).toFixed(2)}
        </span>
      )
    },
    {
      header: "Stock",
      className: "w-[120px]",
      accessor: (row) => (
        <div className="flex flex-col">
           <span className={`font-bold ${row.quantity <= 5 ? 'text-red-500' : 'text-gray-900'}`}>
            {row.quantity} units
          </span>
          {row.quantity <= 5 && (
            <span className="text-[10px] text-red-400 font-bold flex items-center gap-1 uppercase">
              <AlertCircle className="w-3 h-3" /> Low Stock
            </span>
          )}
        </div>
      )
    },
    {
      header: "Status",
      className: "w-[100px]",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${row.isActive ? 'bg-[#33D073]' : 'bg-gray-300'}`} />
          <span className={`text-[11px] font-bold uppercase ${row.isActive ? 'text-[#33D073]' : 'text-gray-400'}`}>
            {row.isActive ? 'Active' : 'Private'}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-tight text-gray-900">Product Catalog</h1>
          <p className="text-gray-500 font-medium text-sm">Manage items, stock levels, and pricing for your gym shop.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedProduct(undefined);
            setIsModalOpen(true);
          }}
          className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={products} 
        isLoading={isLoading}
        actions={[
          { 
            label: "Edit Product", 
            onClick: (row) => {
              setSelectedProduct(row);
              setIsModalOpen(true);
            } 
          },
          { 
            label: "Delete", 
            onClick: handleDelete,
            className: "text-red-500"
          },
        ]}
      />

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts}
        product={selectedProduct}
      />
    </div>
  );
}

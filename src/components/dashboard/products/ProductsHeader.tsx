import { Plus } from "lucide-react";

interface ProductsHeaderProps {
    onAddClick: () => void;
    canCreate: boolean;
}

export function ProductsHeader({ onAddClick, canCreate }: ProductsHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4 tracking-tight">
                    Products
                </h1>
                <p className="text-gray-500 font-medium text-sm">
                    Manage inventory, prices, and stock levels for your gym products.
                </p>
            </div>
            {canCreate && (
                <button
                    onClick={onAddClick}
                    className="bg-[#e60023] hover:bg-[#c4001f] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#e60023]/20 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            )}
        </div>
    );
}

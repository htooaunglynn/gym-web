"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { MemberSelect } from "../forms/MemberSelect";
import { ProductSelect } from "../forms/ProductSelect";

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sale?: ExistingSale; // If provided, we are in VIEW/EDIT mode
}

interface MemberSummary {
  id?: string;
  firstName?: string;
  lastName?: string;
}

interface ProductSummary {
  id: string;
  name?: string;
  quantity: number;
  unitPrice: number | string;
}

interface CartItem extends ProductSummary {
  salePrice: number | string;
}

interface ExistingSaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: {
    name?: string;
  };
}

interface ExistingSale {
  member?: MemberSummary | null;
  items: ExistingSaleItem[];
  paymentStatus: string;
  paymentMethod?: string;
  paymentReference?: string;
  discountAmount?: number;
  taxAmount?: number;
  note?: string;
}

export function SaleModal({
  isOpen,
  onClose,
  onSuccess,
  sale,
}: SaleModalProps) {
  const [selectedMember, setSelectedMember] = useState<MemberSummary | null>(
    null,
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentData, setPaymentData] = useState({
    paymentStatus: "PAID",
    paymentMethod: "CASH",
    paymentReference: "",
    discountAmount: "0",
    taxAmount: "0",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartErrors, setCartErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sale) {
      setSelectedMember(sale.member ?? null);
      setCart(
        sale.items.map((item) => ({
          id: item.productId,
          name: item.product?.name ?? "Unnamed Product",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          salePrice: item.unitPrice,
        })),
      );
      setPaymentData({
        paymentStatus: sale.paymentStatus,
        paymentMethod: sale.paymentMethod || "CASH",
        paymentReference: sale.paymentReference || "",
        discountAmount: sale.discountAmount?.toString() || "0",
        taxAmount: sale.taxAmount?.toString() || "0",
        note: sale.note || "",
      });
    } else {
      setSelectedMember(null);
      setCart([]);
      setCartErrors({});
      setPaymentData({
        paymentStatus: "PAID",
        paymentMethod: "CASH",
        paymentReference: "",
        discountAmount: "0",
        taxAmount: "0",
        note: "",
      });
    }
  }, [sale, isOpen]);

  if (!isOpen) return null;

  const addToCart = (product: ProductSummary) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.quantity) {
        alert("Cannot add more than available stock");
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        { ...product, quantity: 1, salePrice: product.unitPrice },
      ]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
    // Clear the error for this item when the user adjusts the quantity
    if (cartErrors[productId]) {
      setCartErrors((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce(
      (acc, item) => acc + parseFloat(String(item.salePrice)) * item.quantity,
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const discount = parseFloat(paymentData.discountAmount) || 0;
  const tax = parseFloat(paymentData.taxAmount) || 0;
  const total = subtotal - discount + tax;

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (cart.length === 0) {
      setError("Please add at least one product to the sale.");
      return;
    }

    // Validate all cart item quantities are >= 1
    const errors: Record<string, string> = {};
    cart.forEach((item) => {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        errors[item.id] = "Quantity must be at least 1";
      }
    });
    if (Object.keys(errors).length > 0) {
      setCartErrors(errors);
      setError("Please fix the quantity errors before submitting.");
      return;
    }
    setCartErrors({});

    setLoading(true);
    setError(null);

    try {
      const payload = {
        memberId: selectedMember?.id || null,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        discountAmount: discount,
        taxAmount: tax,
        paymentStatus: paymentData.paymentStatus,
        paymentMethod: paymentData.paymentMethod,
        paymentReference: paymentData.paymentReference,
        note: paymentData.note,
      };

      await apiClient("/product-sales", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create sale.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-5xl shadow-2xl overflow-hidden flex h-[85vh] text-gray-900">
        {/* Left Side: Cart & Selection */}
        <div className="flex-1 flex flex-col bg-gray-50/50">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5C39]/10 flex items-center justify-center text-[#FF5C39]">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                New Sale
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Member Selection */}
            <MemberSelect
              selectedMemberId={selectedMember?.id}
              onSelect={setSelectedMember}
            />

            {/* Product Selection */}
            <div className="space-y-4">
              <ProductSelect onSelect={addToCart} />

              {/* Cart Items */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Cart Items ({cart.length})
                </label>
                {cart.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-gray-200 rounded-[24px] flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Package className="w-8 h-8 opacity-20" />
                    <span className="text-sm font-semibold">
                      Your cart is empty
                    </span>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold">
                            {(item.name?.[0] ?? "?").toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 truncate">
                              {item.name ?? "Unnamed Product"}
                            </h4>
                            <p className="text-[11px] font-mono text-gray-400">
                              ${parseFloat(String(item.salePrice)).toFixed(2)} / unit
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div
                            className={`flex items-center gap-1 p-1 rounded-xl ${cartErrors[item.id] ? "bg-red-50 ring-1 ring-red-300" : "bg-gray-100"}`}
                          >
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-500 transition-all"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-500 transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right w-24">
                            <p className="text-sm font-bold text-gray-900 font-mono">
                              $
                              {(
                                parseFloat(String(item.salePrice)) *
                                item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="w-10 h-10 rounded-xl bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {cartErrors[item.id] && (
                          <p className="text-[11px] font-bold text-red-500 pl-16">
                            {cartErrors[item.id]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Checkout Summary */}
        <div className="w-[350px] border-l border-gray-100 flex flex-col p-8 bg-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>

          <h3 className="text-xl font-bold text-gray-900 mb-8 mt-2">Summary</h3>

          <div className="space-y-6 flex-1">
            {/* Payment Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">
                  Payment Method
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none text-sm font-bold bg-white"
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Credit/Debit Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="ONLINE">Online Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">
                  Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Ref # / TXN ID"
                  value={paymentData.paymentReference}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      paymentReference: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div className="h-px bg-gray-50 my-6" />

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="text-gray-900 font-bold font-mono">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Discount</span>
                <div className="flex items-center gap-1 border-b border-gray-100 pb-0.5">
                  <span className="text-gray-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    className="w-16 text-right focus:outline-none font-bold text-red-500 text-sm font-mono"
                    value={paymentData.discountAmount}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        discountAmount: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Tax</span>
                <div className="flex items-center gap-1 border-b border-gray-100 pb-0.5">
                  <span className="text-gray-400 font-mono text-xs">$</span>
                  <input
                    type="number"
                    className="w-16 text-right focus:outline-none font-bold text-gray-900 text-sm font-mono"
                    value={paymentData.taxAmount}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        taxAmount: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-900/5 mt-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-gray-900 font-mono tracking-tighter">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-[11px] font-bold rounded-xl border border-red-100 animate-in shake">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || cart.length === 0}
            className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl shadow-gray-900/10 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Complete Sale
                <ArrowRight className="w-5 h-5 opacity-50" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Internal Icon constant to avoid import issues
function Package({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.5 4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

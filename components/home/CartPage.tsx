"use client";

import { CartItem } from "@/lib/types";

interface CartPageProps {
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onStartShopping: () => void;
}

export default function CartPage({
  items,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onStartShopping,
}: CartPageProps) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-white/70">Cart page coming soon...</p>
        <button
          onClick={onStartShopping}
          className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

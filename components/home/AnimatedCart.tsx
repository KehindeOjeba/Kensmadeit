"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cartStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface AnimatedCartProps {
  itemCount: number;
  onClick?: () => void;
}

export default function AnimatedCart({ itemCount, onClick }: AnimatedCartProps) {
  const router = useRouter();
  const { getItemCount } = useCart();
  const [showModal, setShowModal] = useState(false);
  const cartItemCount = getItemCount();

  const handleClick = () => {
    if (cartItemCount > 0) {
      router.push("/shop/cart")
      return
    }

    setShowModal(true)
  }

  const handleStartShopping = () => {
    setShowModal(false)
    router.push("/shop")
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="text-white/70 hover:text-orange-400 transition-colors relative"
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {cartItemCount === 0 ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
                <DialogTitle className="text-center">Cart is Emptyyyyy😔</DialogTitle>
                <DialogDescription className="text-center">
                  You have not added any items to your cart yet.
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle className="text-center">
                  {cartItemCount} item{cartItemCount !== 1 ? "s" : ""} in cart
                </DialogTitle>
                <DialogDescription className="text-center">
                  Ready to checkout?
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-6">
            {cartItemCount === 0 ? (
              <Button onClick={handleStartShopping} className="w-full">
                Start Shopping
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    router.push("/shop/cart");
                  }}
                  className="w-full"
                >
                  Go to Cart
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

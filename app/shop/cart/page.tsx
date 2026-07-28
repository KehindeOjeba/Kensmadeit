'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/store/cartStore'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckingOut(true)
    router.push('/shop/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-600 mb-8">
              Start shopping and add items to your cart to get started.
            </p>
            <Link href="/shop">
              <Button size="lg" className='cursor-pointer'>
                Continue Shopping
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
       
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link href="/" className="hover:text-orange-600">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Shopping Cart</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            
              <div className="border-b border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-slate-900">
                    Shopping Cart
                  </h1>
                  <p className="text-sm text-slate-600">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              
              <div className="divide-y divide-slate-200" data-testid="checkout-items">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex gap-6 hover:bg-slate-50 transition"
                  >
                   
                    <Link
                      href={`/shop/product/${item.slug}`}
                      className="flex-shrink-0"
                    >
                      <div className="relative h-24 w-24 bg-slate-100 rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                          src={item.images[0] || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </Link>

                    <div className="flex-1">
                      <Link
                        href={`/shop/product/${item.slug}`}
                        className="hover:text-orange-600"
                      >
                        <h3 className="font-semibold text-slate-900 hover:text-orange-600">
                          {item.name}
                        </h3>
                      </Link>
                      {item.size && (
                        <p className="text-sm text-slate-500 mt-1">
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-slate-500">
                          Color: {item.color}
                        </p>
                      )}
                      <p className="text-orange-600 font-bold mt-2">
                        ₦{Number(item.price).toLocaleString()}
                      </p>

                    
                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center border border-slate-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-slate-600 hover:bg-slate-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 text-slate-900 font-medium min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-slate-600 hover:bg-slate-50"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition"
                          aria-label="Remove from cart"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                  
                    <div className="text-right">
                      <p className="text-slate-600 text-sm mb-2">Subtotal</p>
                      <p className="text-lg font-bold text-slate-900">
                        ₦
                        {(
                          Number(item.price) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>


              <div className="bg-slate-50 p-6 border-t border-slate-200">
                <Link href="/shop">
                  <Button variant="outline" className="w-full cursor-pointer">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Order Summary
              </h2>

           
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600" data-testid="cart-subtotal">
                  <span>Subtotal</span>
                  <span>₦{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (VAT)</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

            
              <div className="border-t border-slate-200 my-4"></div>

            
              <div className="flex justify-between items-center mb-6" data-testid="cart-total">
                <span className="text-lg font-semibold text-slate-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  ₦{getTotal().toLocaleString()}
                </span>
              </div>


              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full mb-3 gap-2"
                disabled={isCheckingOut}
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Button>

             
              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear Cart
              </Button>

           
              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <p className="text-xs text-orange-700">
                  You can review your order before making payment during
                  checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

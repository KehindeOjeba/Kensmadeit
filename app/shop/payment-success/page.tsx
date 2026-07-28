'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/store/cartStore'
import { Check, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface OrderData {
  id: string
  orderNumber: string
  paymentStatus: string
  orderStatus: string
  customerName: string
  customerEmail: string
  totalAmount: number
  createdAt: string
}

function PaymentSuccessPageContent()  {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { clearCart } = useCart()

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true)
        const reference = searchParams?.get('reference')
        const email = searchParams?.get('email')

        if (!reference || !email) {
          setError('Invalid payment parameters')
          return
        }

       
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, email }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Payment verification failed')
        }

        const data = await res.json()
        setOrder(data.order)

      
        clearCart()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">
            Payment Verification Failed
          </h2>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full cursor-pointer">
                Return Home
              </Button>
            </Link>
            <Link href="/shop/cart" className="flex-1">
              <Button className="w-full cursor-pointer">Back to Cart</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-slate-600">No order found</p>
          <div className="mt-6">
            <Link href="/" className="inline-block">
              <Button className="w-full">Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
       
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-green-100">Your order has been confirmed</p>
          </div>

     
          <div className="p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-slate-900 mb-4">
                Order Confirmation
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order Number:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Order Date:</span>
                  <span className="text-slate-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>

           
            <div className="mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">
                Delivery Information
              </h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-900 font-medium">{order.customerName}</p>
                <p className="text-slate-600">{order.customerEmail}</p>
              </div>
            </div>

           
            <div className="border-t border-slate-200 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-900">
                  Order Total:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ₦{Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>


            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <p className="text-yellow-900 text-sm">
                ✓ A confirmation email has been sent to{' '}
                <strong>{order.customerEmail}</strong>
              </p>
              <p className="text-yellow-900 text-sm mt-2">
                ✓ You will receive tracking information once your order ships
              </p>
            </div>

           
            <div className="flex gap-4">
              <Link href="/shop" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">Return Home</Button>
              </Link>
            </div>
          </div>
        </div>

        
        <div className="mt-8 text-center text-slate-600">
          <p>
            Have questions? Contact us at{' '}
            <a href="mailto:kensmadeit13@gmail.com" className="text-blue-600 hover:underline">
              kensmadeit13@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentSuccessPageContent />
    </Suspense>
  )
}

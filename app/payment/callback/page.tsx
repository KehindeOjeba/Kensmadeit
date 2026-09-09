'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/store/cartStore'
import Lottie from 'lottie-react';
import cartAnimation from "@/assets/cart-animation.json";


type CallbackState = 'loading' | 'success' | 'failed' | 'cancelled'

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [state, setState] = useState<CallbackState>('loading')
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    const reference = searchParams.get('reference')
    const paymentStatus = searchParams.get('status')

    if (paymentStatus === 'cancelled') {
      setState('cancelled')
      setMessage('Your payment could not be completed😞. Please try again.')
      return
    }

    if (!reference) {
      setState('failed')
      setMessage('Your payment could not be completed or verified😞. Please try again.')
      return
    }

    let isMounted = true

    const verifyPayment = async () => {
      try {
        setState('loading')
        setMessage('Verifying your payment...')

        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        })

        if (!res.ok) {
          throw new Error('Verification failed')
        }

        const data = await res.json()

        if (!isMounted) return

        setOrderNumber(data.orderNumber ?? null)
        clearCart()
        setState('success')
        setMessage('Yayyy!🥳Your order is on the way.💃')
      } catch {
        if (!isMounted) return
        setState('failed')
        setMessage('Your payment could not be completed or verified. Please try again.')
      }
    }

    verifyPayment()

    return () => {
      isMounted = false
    }
  }, [clearCart, searchParams])

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Verifying your payment...</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Please wait while we confirm your payment with Paystack.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-2">
        <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
          <div className="bg-black p-8 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Payment Successful</h1>
            <p className="mt-2 text-sm text-emerald-100">{message}</p>
             <Lottie
            animationData={cartAnimation}
            className="h-30 w-40 mx-auto mt-4"
          />
          </div>

          <div className="space-y-2 p-4 sm:p-8">
            {orderNumber && (
              <div className="rounded-xl bg-orange-500 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Order Number</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{orderNumber}</p>
              </div>
            )}

            <p className="text-sm leading-6 text-slate-600">
              Thank you for shopping with us❤️<br/> Please come back soon.
            </p>

            <Link href="/" className="block">
              <Button className="h-12 w-full text-base font-medium text-orange-200">Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const title = state === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed'

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
          <Link href="/" className="mt-6 block w-full">
            <Button className="h-12 w-full text-base font-medium">Returns to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 px-4 py-12">
          <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4 text-slate-600">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  )
}

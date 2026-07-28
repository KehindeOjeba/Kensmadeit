'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/lib/store/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Check, Loader2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface ShippingAddress {
  address: string
  city: string
  state: string
  country: string
  postalCode: string
}

interface FormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: ShippingAddress
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: {
      address: '',
      city: '',
      state: '',
      country: 'Nigeria',
      postalCode: '',
    },
  })

 
  useEffect(() => {
    if (items.length === 0) {
      router.push('/shop/cart')
    }
  }, [items, router])

  const handleInputChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value,
      },
    }))
  }

  const validateForm = () => {
    const errors = []

    if (!formData.customerName.trim()) errors.push('Name is required')
    if (!formData.customerEmail.trim()) errors.push('Email is required')
    if (!formData.customerPhone.trim()) errors.push('Phone is required')
    if (!formData.shippingAddress.address.trim()) errors.push('Address is required')
    if (!formData.shippingAddress.city.trim()) errors.push('City is required')
    if (!formData.shippingAddress.state.trim()) errors.push('State is required')
    if (!formData.shippingAddress.postalCode.trim())
      errors.push('Postal code is required')

    if (errors.length > 0) {
      setError(errors.join(', '))
      return false
    }

    return true
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setStep('payment')
  }

  const initializePaystackPayment = async () => {
    setLoading(true)
    setError(null)

    try {
      
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingAddress: formData.shippingAddress,
          items: items.map((item) => ({
            productId: item.productId || item.id,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
          totalAmount: getTotal(),
        }),
      })

      if (!orderRes.ok) {
        const error = await orderRes.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const { order } = await orderRes.json()

      // payment
      const paystackRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          email: formData.customerEmail,
          amount: getTotal() * 100, // Convert to kobo
          reference: order.orderNumber,
        }),
      })

      if (!paystackRes.ok) {
        throw new Error('Failed to initialize payment')
      }

      const { authorizationUrl } = await paystackRes.json()

      // Redirect to paymenttttt
      window.location.href = authorizationUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  const total = getTotal()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            <Link href="/shop/cart">
              <Button variant="ghost" className="gap-2">
                <ChevronLeft size={18} />
                Back to Cart
              </Button>
            </Link>
          </div>

        
          <div className="mt-4 flex items-center gap-4">
            <div className={`flex-1 h-2 rounded-full ${step === 'shipping' || step === 'payment' ? 'bg-orange-600' : 'bg-slate-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step === 'payment' ? 'bg-orange-600' : 'bg-slate-200'}`}></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
           
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-green-700">{success}</p>
                </div>
              )}

              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">
                    Shipping Information
                  </h2>

                 
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Kenny Ojeba"
                        value={formData.customerName}
                        onChange={(e) =>
                          handleInputChange('customerName', e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          placeholder="kennyoj@example.com"
                          value={formData.customerEmail}
                          onChange={(e) =>
                            handleInputChange('customerEmail', e.target.value)
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                          Phone Number *
                        </label>
                        <Input
                          type="tel"
                          placeholder="+234 ********"
                          value={formData.customerPhone}
                          onChange={(e) =>
                            handleInputChange('customerPhone', e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                 
                  <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">
                      Shipping Address
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                          Street Address *
                        </label>
                        <Input
                          type="text"
                          placeholder="145 Ochird Street"
                          value={formData.shippingAddress.address}
                          onChange={(e) =>
                            handleAddressChange('address', e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            City *
                          </label>
                          <Input
                            type="text"
                            placeholder="Lagos"
                            value={formData.shippingAddress.city}
                            onChange={(e) =>
                              handleAddressChange('city', e.target.value)
                            }
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            State/Province *
                          </label>
                          <Input
                            type="text"
                            placeholder="Lagos"
                            value={formData.shippingAddress.state}
                            onChange={(e) =>
                              handleAddressChange('state', e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Country *
                          </label>
                          <Input
                            type="text"
                            value={formData.shippingAddress.country}
                            disabled
                            className="bg-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Postal Code *
                          </label>
                          <Input
                            type="text"
                            placeholder="100001"
                            value={formData.shippingAddress.postalCode}
                            onChange={(e) =>
                              handleAddressChange('postalCode', e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                
                  <div className="mt-8 flex gap-4">
                    <Link href="/shop/cart" className="flex-1">
                      <Button variant="outline" className="w-full cursor-pointer">
                        Back to Cart
                      </Button>
                    </Link>
                    <Button type="submit" className="flex-1" size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              )}

              {step === 'payment' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">
                    Payment Method
                  </h2>

                
                  <div className="bg-slate-50 rounded-lg p-6 mb-8">
                    <h3 className="font-medium text-slate-900 mb-3">
                      Shipping To:
                    </h3>
                    <p className="text-slate-700">
                      <strong>{formData.customerName}</strong>
                    </p>
                    <p className="text-slate-600">
                      {formData.shippingAddress.address}, {formData.shippingAddress.city},
                      {formData.shippingAddress.state} {formData.shippingAddress.postalCode}
                    </p>
                    <p className="text-slate-600 mt-2">
                      <strong>Email:</strong> {formData.customerEmail}
                    </p>
                    <p className="text-slate-600">
                      <strong>Phone:</strong> {formData.customerPhone}
                    </p>
                  </div>

                
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                    <p className="text-orange-900">
                      💳 You will be redirected to Paystack to complete your payment
                      securely. We accept all major debit cards, credit cards, bank
                      transfers, and USSD.
                    </p>
                  </div>

                
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep('shipping')}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={initializePaystackPayment}
                      className="flex-1"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay with Paystack - ₦{total.toLocaleString()}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

         
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-32">
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b border-slate-200 last:border-0"
                  >
                    <div className="relative h-16 w-16 bg-slate-100 rounded flex-shrink-0">
                      <Image
                        src={item.images[0] || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-slate-900 line-clamp-1">
                        {item.name}
                      </p>
                      {item.size && (
                        <p className="text-slate-500 text-sm mt-1">
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-slate-500 text-sm">
                          Color: {item.color}
                        </p>
                      )}
                      <p className="text-slate-600">
                        {item.quantity}x ₦{Number(item.price).toLocaleString()}
                      </p>
                      <p className="font-semibold text-slate-900 mt-1">
                        ₦
                        {(Number(item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>Calculated at payment</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-orange-600">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

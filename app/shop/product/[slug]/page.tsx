'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { Product, Review } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/lib/store/cartStore'
import {
  Star,
  ShoppingCart,
  Check,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface ProductDetail extends Product {
  reviews: Review[]
  avgRating: number
  reviewCount: number
  relatedProducts: Product[]
}

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showAddedDialog, setShowAddedDialog] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const { addItem } = useCart()

 
  useEffect(() => {
    const fetchProduct = async () => {
       console.log('Fetching product:', slug)
      setLoading(true)
      setError(null)

      try {
        const detailRes = await fetch(`/api/products/slug/${encodeURIComponent(slug)}`)
        if (!detailRes.ok) throw new Error('Product not found')

        const detail = await detailRes.json()
        setProduct(detail.product)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0])
    } else {
      setSelectedSize('')
    }
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0])
    } else {
      setSelectedColor('')
    }
  }, [product])

  useEffect(() => {
    if (!product?.colors?.length || !product?.images?.length || !selectedColor) return

    const normalizedColor = selectedColor.toLowerCase()

    const filenameMatchIndex = product.images.findIndex((image) =>
      image.toLowerCase().includes(normalizedColor)
    )

    const colorIndex = filenameMatchIndex !== -1
      ? filenameMatchIndex
      : product.colors.findIndex((color) => color.toLowerCase() === normalizedColor)

    if (colorIndex !== -1 && product.images[colorIndex] && selectedImage !== colorIndex) {
      setSelectedImage(colorIndex)
    }
  }, [selectedColor, product, selectedImage])

  const handleAddToCart = () => {
    if (!product) return

    const size = selectedSize || product.sizes?.[0]
    const color = selectedColor || product.colors?.[0]

    addItem({
      id: `${product.id}-${size ?? 'default'}-${color ?? 'default'}`,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      images: product.images,
      quantity,
      slug: product.slug,
      size,
      color,
    })

    setShowAddedDialog(true)
  }

  const router = useRouter()

  const handleGoToCart = () => {
    setShowAddedDialog(false)
    router.push('/shop/cart')
  }

  const handleContinueShopping = () => {
    setShowAddedDialog(false)
    router.push('/shop')
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setSubmittingReview(true)
    try {
      const res = await fetch(`/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ...reviewData,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit review')

     
      setReviewData({ name: '', email: '', rating: 5, comment: '' })
      setShowReviewForm(false)
   
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
              <div>
                <Skeleton className="relative h-96 rounded-lg overflow-hidden mb-4" />
                <div className="flex gap-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="relative h-20 w-20 rounded-lg" />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <Skeleton className="inline-block h-6 w-24 rounded-full" />
                </div>

                <Skeleton className="h-8 rounded w-3/4 mb-3" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-4 rounded" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-20 rounded" />
                </div>

                <Skeleton className="h-24 mb-6 rounded" />

                <div className="flex items-baseline gap-3 mb-6">
                  <Skeleton className="h-8 w-32 rounded" />
                </div>

                <div className="mb-6">
                  <Skeleton className="h-4 rounded w-1/3 mb-2" />
                </div>

                <div className="flex gap-4">
                  <Skeleton className="h-10 w-28 rounded" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-red-700 mb-4">
            {error || 'The product you are looking for does not exist.'}
          </p>
          <Link href="/shop">
            <Button className='cursor-pointer'>Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-900 via-gray-900 to-orange-900">
    
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
            <ChevronRight size={16} />
            <Link href="/shop" className="hover:text-orange-600">
              Shop
            </Link>
            <ChevronRight size={16} />
            <span className="text-slate-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bbg-linear-to-br from-black via-gray-900 to-orange-900 rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
         
            <div>
              <div className="relative h-96 bg-slate-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.images[selectedImage] || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

           
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {product.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                        selectedImage === idx
                          ? 'border-orange-600'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Product ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

           
            <div>
          
              <div className="mb-3">
                <span className="inline-block bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
                  {product.category?.name}
                </span>
              </div>


              <h1 className="text-3xl font-bold text-white mb-3">
                {product.name}
              </h1>


              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.round(product.avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">
{product.reviewCount > 0 ? (
  <>
    {(product.avgRating ?? 0).toFixed(1)} ({product.reviewCount} reviews)
  </>
) : (
  "No reviews yet"
)}
                </span>
              </div>

            
              <p className="text-slate-400 mb-6 leading-relaxed">
                {product.description}
              </p>

             
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-white">
                  ₦{Number(product.price).toLocaleString()}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-slate-500 line-through">
                    ₦{Number(product.comparePrice).toLocaleString()}
                  </span>
                )}
              </div>

             
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-green-600 font-medium flex items-center gap-2">
                    <Check size={18} />
                    In Stock - {product.stock} available
                  </p>
                ) : (
                  <p className="text-red-600 font-medium">Out of Stock</p>
                )}
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Select Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-slate-100"
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Select Color
                  </label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 text-slate-100"
                  >
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="text-sm text-slate-300 mb-6">
                <p>
                  SKU:{' '}
                  <span className="font-medium text-slate-400">{product.sku}</span>
                </p>
              </div>

              
              {product.stock > 0 && (
                <div className="flex gap-4">
                  <div className="flex items-center border border-orange-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-slate-200 "
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-l border-r border-orange-300 text-white py-3"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 text-slate-200 "
                    >
                      +
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 gap-2 relative overflow-hidden border-orange-500 bg-amber-100 text-black"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </Button>
                </div>
              )}

              <Dialog open={showAddedDialog} onOpenChange={setShowAddedDialog}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="mt-4 text-center">Added to Cart!</DialogTitle>
                    <DialogDescription className="text-center">
                      <span className="font-semibold text-gray-900">{product.name}</span>
                      {' '}has been added to your cart.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-3 mt-6">
                    <Button onClick={handleGoToCart} className="w-full">
                      Go to Cart
                    </Button>
                    <Button onClick={handleContinueShopping} variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

             
              {product.tags && product.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-900 mb-3">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-10 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Customer Reviews
          </h2>

         
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="outline"
            className="mb-6"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </Button>

         
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-slate-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={reviewData.name}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, name: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={reviewData.email}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, email: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                    >
                      <Star
                        size={24}
                        className={
                          star <= reviewData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <Textarea
                  placeholder="Your Review"
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                />
              </div>

              <Button type="submit" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          )}

         
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-slate-200 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-900">{review.name}</p>
                      <p className="text-sm text-slate-500">{review.email}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-slate-700 text-sm">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>

      
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/shop/product/${relatedProduct.slug}`}
                  className="group"
                >
                  <div className="bg-slate-100 rounded-lg overflow-hidden h-48 mb-3 relative">
                    <Image
                      src={relatedProduct.images[0] || '/placeholder.png'}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium text-slate-900 group-hover:text-orange-600 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-orange-600 font-bold mt-1">
                    ₦{Number(relatedProduct.price).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

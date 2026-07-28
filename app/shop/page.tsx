'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/lib/store/cartStore'
import ProductCard from '@/components/ProductCard'
import AnimatedCart from '@/components/home/AnimatedCart'

interface Product {
  id: string
  name: string
  slug: string
  price: string | number
  comparePrice?: string | number | null
  images: string[]
  stock: number
  categoryId?: string | null
  category?: { id: string; name: string; slug: string } | null
  avgRating?: number
  sizes?: string[]
  _count?: { reviews: number }
}

interface Category {
  id: string
  name: string
  slug: string
  _count?: { products: number }
}

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [addedProductIds, setAddedProductIds] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const { addItem } = useCart()

  // Initialize search params after hydration
  useEffect(() => {
    if (searchParams) {
      setSelectedCategory(searchParams.get('category'))
      setSearchQuery(searchParams.get('search') || '')
      setIsHydrated(true)
    }
  }, [searchParams])

  
  useEffect(() => {
    const fetchCategories = async () => {
      let retries = 3
      while (retries > 0) {
        try {
          const res = await fetch('/api/categories')
          if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`)
          const data = await res.json()
          setCategories(Array.isArray(data) ? data : [])
          return
        } catch (err) {
          retries--
          if (retries === 0) {
            console.error('Failed to fetch categories after retries:', err)
          } else {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
      }
    }

    fetchCategories()
  }, [])

  
  useEffect(() => {
    if (!isHydrated) return

    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      let retries = 3
      let success = false
      
      while (retries > 0 && !success) {
        try {
          const params = new URLSearchParams({
            limit: '1000',
            sort: sortBy,
          })

          if (selectedCategory) {
            params.append('category', selectedCategory)
          }

          if (searchQuery) {
            params.append('search', searchQuery)
          }

          const res = await fetch(`/api/products?${params}`)
          if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)

          const data = await res.json()

          setProducts(Array.isArray(data.products) ? data.products : [])
          setError(null)
          success = true
        } catch (err) {
          retries--
          if (retries === 0) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            setProducts([])
          } else {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
      }
      setLoading(false)
    }

    fetchProducts()
  }, [selectedCategory, searchQuery, sortBy, isHydrated])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      images: product.images,
      quantity: 1,
      slug: product.slug,
    })

    setAddedProductIds((prev) => [...prev, product.id])
    setTimeout(() => {
      setAddedProductIds((prev) => prev.filter((id) => id !== product.id))
    }, 2000)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-900 via-gray-900 to-orange-900">
      
      <div className="bg-linear-to-br from-black via-gray-900 to-orange-900 border-b border-orange-600 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-orange-500">Shop</h1>
            <AnimatedCart itemCount={0} />
          </div>

          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-white"
              />
              <Button type="submit" className="cursor-pointer border-amber-50">
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">

          <aside className="w-64 hidden lg:block">
          
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md cursor-pointer transition ${
                    !selectedCategory
                      ? 'bg-orange-50 text-orange-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.slug)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md cursor-pointer transition ${
                      selectedCategory === category.slug
                        ? 'bg-orange-50 text-orange-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {category.name}
                    <span className="text-sm text-slate-500 ml-2">
                      ({category._count?.products || 0})
                    </span>
                  </button>
                ))}
              </div>
            </div>

           
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Sort By
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'newest', label: 'Newest' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'name-asc', label: 'Name: A to Z' },
                  { value: 'name-desc', label: 'Name: Z to A' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => {
                        setSortBy(e.target.value)
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

       
          <main className="flex-1">
          
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCard key={i} loading />
                ))}
              </div>
            )}

          
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

          
            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      data-testid="product-card"
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group"
                    >
                     
                      <Link href={`/shop/product/${product.slug}`}>
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                          <Image
                            src={product.images[0] || '/placeholder.png'}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>

                    
                      <div className="p-4">
                     
                        <div className="mb-2">
                          <span className="inline-block bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-0.5 rounded">
                            {product.category?.name}
                          </span>
                        </div>

                       
                        <Link href={`/shop/product/${product.slug}`}>
                          <h3 className="text-sm font-semibold text-slate-900 hover:text-orange-600 line-clamp-2 mb-2">
                            {product.name}
                          </h3>
                        </Link>

                       
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < Math.round(product.avgRating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-slate-300'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-600">
                            ({product._count?.reviews || 0})
                          </span>
                        </div>

                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold text-slate-900" data-testid="product-price">
                            ₦{parseFloat(String(product.price)).toLocaleString('en-NG', {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm text-slate-500 line-through">
                              ₦{parseFloat(String(product.comparePrice)).toLocaleString('en-NG', {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          )}
                        </div>

                      
                        {product.stock > 0 ? (
                          <p className="text-xs text-green-600 font-medium mb-3">
                            In Stock ({product.stock} available)
                          </p>
                        ) : (
                          <p className="text-xs text-red-600 font-medium mb-3">
                            Out of Stock
                          </p>
                        )}

                       
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className={`w-full gap-2 cursor-pointer ${addedProductIds.includes(product.id) ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                        >
                          <ShoppingCart size={16} />
                          {addedProductIds.includes(product.id) ? 'Added' : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

               
              
              </>
            )}

           
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12 bg-gray-100 rounded-lg shadow-sm">
                <p className="text-slate-600 text-lg mb-4">No products found</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory(null)
                    setSearchQuery('')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

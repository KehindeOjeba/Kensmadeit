"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/lib/store/cartStore"
import type { CartItem } from "@/lib/types"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  slug?: string
  sizes?: string[]
  isNew?: boolean
  isOnSale?: boolean
  salePrice?: number
}

interface ProductCardProps {
  product?: Product
  loading?: boolean
}

export default function ProductCard({ product, loading }: ProductCardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [showDialog, setShowDialog] = useState(false)

  const handleAddToCart = () => {
    if (!product) return

    const cartItem: CartItem = {
      id: `${product.id}-${product.sizes?.[0] ?? 'default'}`,
      productId: product.id,
      name: product.name,
      price: product.isOnSale && product.salePrice ? product.salePrice : product.price,
      images: [product.image],
      quantity: 1,
      slug: product.slug || product.id,
      size: product.sizes?.[0],
    }
    addItem(cartItem)
    setShowDialog(true)
  }

  const handleGoToCart = () => {
    setShowDialog(false)
    router.push("/shop/cart")
  }

  const handleContinueShopping = () => {
    setShowDialog(false)
  }
  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="relative h-64 md:h-72 overflow-hidden rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-3 rounded w-3/4" />
                <Skeleton className="h-3 rounded w-1/2" />
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-6 rounded w-24" />
                  <Skeleton className="h-8 rounded w-20" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <Link href={`/shop/product/${product?.slug || product?.id}`}>
                  <div className="relative h-64 md:h-72 overflow-hidden">
                    {product?.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {product?.isNew && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                        New
                      </span>
                    )}
                    {product?.isOnSale && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                        Sale
                      </span>
                    )}
                  </div>
                </Link>

                <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white hover:bg-gray-100"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white hover:bg-gray-100"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product?.category}
                  </span>
                </div>

                <Link href={`/shop/product/${product?.slug || product?.id}`}>
                  <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                    {product?.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div>
                    {product?.isOnSale && product?.salePrice ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-500">
                          ${product.salePrice}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold">
                        ${product?.price}
                      </span>
                    )}
                  </div>

                  <Button size="sm" className="text-xs" onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="mt-4 text-center">Added to Cart!</DialogTitle>
            <DialogDescription className="text-center">
              <span className="font-semibold text-gray-900">{product?.name ?? 'Item'}</span>
              {" "}has been added to your cart.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={handleGoToCart}
              className="w-full"
            >
              Go to Cart
            </Button>
            <Button
              onClick={handleContinueShopping}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

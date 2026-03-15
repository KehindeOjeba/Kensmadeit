import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
  isOnSale?: boolean
  salePrice?: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/products/${product.id}`}>
            <div className="relative h-64 md:h-72 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                  New
                </span>
              )}
              {product.isOnSale && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                  Sale
                </span>
              )}
            </div>
          </Link>
          
          {/* Quick Actions */}
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
              {product.category}
            </span>
          </div>
          
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              {product.isOnSale && product.salePrice ? (
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
                  ${product.price}
                </span>
              )}
            </div>
            
            <Button size="sm" className="text-xs">
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

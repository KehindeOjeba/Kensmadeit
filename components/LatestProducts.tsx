import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "./ProductCard"

// Mock data - replace with actual data from your database
const latestProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 89.99,
    image: "/images/IMG_7194.jpg",
    category: "Electronics",
    isNew: true,
    isOnSale: false
  },
  {
    id: "2", 
    name: "Designer Leather Bag",
    price: 149.99,
    image: "/images/IMG_9160.jpg",
    category: "Fashion",
    isNew: false,
    isOnSale: true,
    salePrice: 99.99
  },
  {
    id: "3",
    name: "Smart Watch Pro",
    price: 299.99,
    image: "/images/IMG_7194 (1).jpg",
    category: "Electronics",
    isNew: true,
    isOnSale: false
  },
  {
    id: "4",
    name: "Vintage Sunglasses",
    price: 49.99,
    image: "/images/IMG_7194.jpg",
    category: "Accessories",
    isNew: false,
    isOnSale: false
  },
  {
    id: "5",
    name: "Running Shoes Sport",
    price: 79.99,
    image: "/images/IMG_9160.jpg",
    category: "Sports",
    isNew: true,
    isOnSale: true,
    salePrice: 59.99
  },
  {
    id: "6",
    name: "Coffee Maker Deluxe",
    price: 129.99,
    image: "/images/IMG_7194 (1).jpg",
    category: "Home",
    isNew: false,
    isOnSale: false
  },
  {
    id: "7",
    name: "Yoga Mat Premium",
    price: 34.99,
    image: "/images/IMG_7194.jpg",
    category: "Sports",
    isNew: true,
    isOnSale: false
  },
  {
    id: "8",
    name: "Backpack Travel Pro",
    price: 69.99,
    image: "/images/IMG_9160.jpg",
    category: "Travel",
    isNew: false,
    isOnSale: true,
    salePrice: 49.99
  }
]

export default function LatestProducts() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our newest arrivals and trending products. Fresh styles and innovative 
            designs added regularly to keep you ahead of the curve.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {latestProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/shop">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

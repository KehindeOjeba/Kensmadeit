"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/store/cartStore"

export default function Header() {
  const router = useRouter()
  const { getItemCount } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const itemCount = getItemCount()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 flex-shrink-0">
            KensMadeIt
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/shop" className="hover:text-orange-600 font-medium">
              Shop
            </Link>
            <Link href="/about" className="hover:text-orange-600 font-medium">
              About
            </Link>
            <Link href="/contact" className="hover:text-orange-600 font-medium">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
              <Link href="/admin">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/shop/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </form>
      </div>
    </header>
  )
}

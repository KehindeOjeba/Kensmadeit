
export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number | string
  comparePrice?: number | string | null
  sku: string
  stock: number
  images: string[]
  tags: string[]
  sizes?: string[]
  colors?: string[]
  isActive: boolean
  categoryId: string | null
  createdAt?: string
  category?: Category | null
}

export type ProductWithRating = Product & {
  avgRating: number
}

export type ProductWithReviews = Product & {
  reviews: Review[]
  avgRating: number
  reviewCount: number
  relatedProducts: Product[]
}


export type Category = {
  id: string
  name: string
  slug: string
  description: string
  image?: string
  isActive: boolean
  _count?: { products: number }
}

export type Review = {
  id: string
  productId: string
  name: string
  email: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
  product?: Product
}


export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  images: string[]
  quantity: number
  slug: string
  size?: string
  color?: string
}

export type Cart = {
  items: CartItem[]
  total: number
  itemCount: number
}


export type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    address: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  totalAmount: number | string
  paymentReference?: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  orderItems: OrderItem[]
  customerId?: string | null
}

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  size?: string
  color?: string
  quantity: number
  price: number | string
}

export type OrderInput = {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    address: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
}

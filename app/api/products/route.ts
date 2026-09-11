import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`
    
    const searchParams = request.nextUrl.searchParams
    const categorySlug = searchParams.get('category')
    const search = searchParams.get('search')
    const slug = searchParams.get('slug')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sort = searchParams.get('sort') || 'newest'

    const skip = (page - 1) * limit

    
    const where: Prisma.ProductWhereInput = { isActive: true }

    if (categorySlug) {
      where.category = { slug: categorySlug }
    }

    if (slug) {
      where.slug = slug
    } else if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'name-asc':
        orderBy = { name: 'asc' }
        break
      case 'name-desc':
        orderBy = { name: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // tot count for pageeeee
    const total = await prisma.product.count({ where })

  
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: true,
        _count: {
          select: { reviews: true },
        },
      },
    })

    const productsWithRating = await Promise.all(
      products.map(async (product) => {
        const reviews = await prisma.review.findMany({
          where: { productId: product.id, isApproved: true },
        })
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0
        return {
          ...product,
          avgRating,
        }
      })
    )

    return NextResponse.json(
      {
        products: productsWithRating,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

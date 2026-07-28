import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    
    const reviews = await prisma.review.findMany({
      where: { productId: id, isApproved: true },
      orderBy: { createdAt: 'desc' },
    })

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0

   
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: id },
        isActive: true,
      },
      take: 4,
      include: {
        category: true,
      },
    })

    return NextResponse.json(
      {
        product,
        reviews,
        avgRating,
        reviewCount: reviews.length,
        relatedProducts,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      }
    )
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

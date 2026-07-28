import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, name, email, rating, comment } = body

  
    if (!productId || !name || !email || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    const review = await prisma.review.create({
      data: {
        productId,
        name,
        email,
        rating: parseInt(rating),
        comment: comment || null,
        isApproved: false,
      },
    })

    return NextResponse.json(
      {
        message: 'Review submitted successfully. It will appear after approval.',
        review,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reviews, {
      headers: {
        'Cache-Control': 'public, max-age=1800, s-maxage=1800',
      },
    })
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

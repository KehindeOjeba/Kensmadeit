import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pending = searchParams.get('pending') === 'true';

    const reviews = await prisma.review.findMany({
      where: pending ? { isApproved: false } : {},
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedReviews = reviews.map((review) => ({
      ...review,
      productName: review.product?.name,
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error('Error fetchingggggg reviews', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

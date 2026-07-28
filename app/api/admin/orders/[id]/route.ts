import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { orderStatus } = await request.json();

    if (!orderStatus) {
      return NextResponse.json(
        { error: 'orderStatus is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { orderStatus },
      include: { orderItems: true },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

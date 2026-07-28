import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      name,
      price,
      comparePrice,
      stock,
      description,
      categoryId,
      images,
      tags,
      sizes,
      colors,
      isActive,
    } = body;

    const updateData: Prisma.ProductUpdateInput = {} as Prisma.ProductUpdateInput;

    if (name) updateData.name = name;
    if (price !== undefined)
      updateData.price = parseFloat(price);

    if (comparePrice !== undefined)
      updateData.comparePrice = comparePrice
        ? parseFloat(comparePrice)
        : null;

    if (stock !== undefined)
      updateData.stock = parseInt(stock);

    if (description !== undefined)
      updateData.description = description;

    if (categoryId !== undefined && categoryId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateData.category = { connect: { id: categoryId } } as any;

    if (images)
      updateData.images = images;

    if (tags)
      updateData.tags = tags;

    if (sizes !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updateData as any).sizes = sizes;

    if (colors !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updateData as any).colors = colors;

    if (isActive !== undefined)
      updateData.isActive = isActive;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(product);

  } catch (error) {
    console.error('Error updatinggggg', error);

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error('Error deletinggggggg', error);

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      sku,
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

    if (!name || !sku || !price || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, sku, price, stock' },
        { status: 400 }
      );
    }

   
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  
    let finalCategoryId = categoryId;
    if (!finalCategoryId) {
      const defaultCategory = await prisma.category.findFirst({
        where: { isActive: true },
        select: { id: true },
      });
      finalCategoryId = defaultCategory?.id;
    }

    if (!finalCategoryId) {
      return NextResponse.json(
        { error: 'No categories available. Please create a category first.' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock),
        description: description || '',
        categoryId: finalCategoryId,
        images: images || [],
        tags: tags || [],
        sizes: sizes || [],
        colors: colors || [],
        isActive: isActive !== false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creatingggggg', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

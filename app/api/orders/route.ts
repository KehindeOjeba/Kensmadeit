import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


function generateOrderNumber(): string {
  const prefix = 'KMI' 
  const timestamp = Date.now().toString().slice(-5)
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0')
  return `${prefix}-${timestamp}${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
    } = body


    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

   
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      if (product.trackStock && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }
    }

   
    const orderNumber = generateOrderNumber()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalAmount: Number(totalAmount),
        paymentStatus: 'pending',
        orderStatus: 'pending',
        orderItems: {
          create: items.map((item: { productId: string; quantity: number; price: number; size?: string; color?: string }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderNumber = searchParams.get('orderNumber')
    const email = searchParams.get('email')

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Order number and email are required' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        customerEmail: email,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

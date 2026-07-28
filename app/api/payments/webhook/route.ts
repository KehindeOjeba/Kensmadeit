import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

const PAYSTACK_API_KEY = process.env.PAYSTACK_SECRET_KEY

function verifyPaystackSignature(body: string, signature: string): boolean {
  if (!PAYSTACK_API_KEY) {
    return false
  }

  const hash = crypto
    .createHmac('sha512', PAYSTACK_API_KEY)
    .update(body)
    .digest('hex')

  return hash === signature
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-paystack-signature')
    const bodyText = await request.text()

    if (!signature || !verifyPaystackSignature(bodyText, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(bodyText)

    if (event.event !== 'charge.success') {
      return NextResponse.json({ status: 'ignored' })
    }

    const { reference, amount, metadata } = event.data
    const orderId = metadata?.orderId as string | undefined

    const order = orderId
      ? await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        })
      : await prisma.order.findFirst({
          where: { paymentReference: reference },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        })

    if (!order) {
      console.error(`Order not found for webhook reference=${reference} orderId=${orderId}`)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const expectedAmount = Math.round(Number(order.totalAmount) * 100)
    if (amount !== expectedAmount) {
      console.error(
        `Amount mismatch for order ${order.id}: expected ${expectedAmount}, got ${amount}`
      )
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
    }

    if (order.paymentStatus === 'paid') {
      return NextResponse.json({ status: 'already_processed' })
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'paid',
        orderStatus: 'processing',
        paymentReference: reference,
      },
    })

    for (const item of order.orderItems) {
      if (item.product.trackStock) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }
    }

    try {
      if (process.env.RESEND_API_KEY) {
        const address = order.shippingAddress as Record<string, string>
        const itemsHTML = order.orderItems
          .map(
            (item) =>
              `<tr>
                <td style="padding: 8px; text-align: left;">${item.product.name}</td>
                <td style="padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; text-align: right;">₦${Number(item.price).toLocaleString()}</td>
                <td style="padding: 8px; text-align: right;">₦${(Number(item.price) * item.quantity).toLocaleString()}</td>
              </tr>`
          )
          .join('')

        const emailHTML = `
          <div style="font-family: system-ui, sans-serif; color: #111827;">
            <h1 style="font-size: 24px;">Order Confirmation</h1>
            <p>Thank you for your order! Your payment has been received.</p>
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <h2>Items Ordered</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f3f4f6; text-align: left;">
                  <th style="padding: 8px;">Product</th>
                  <th style="padding: 8px;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Price</th>
                  <th style="padding: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
            <h2>Shipping Address</h2>
            <p>
              ${order.customerName}<br />
              ${address.address}<br />
              ${address.city}, ${address.state}<br />
              ${address.country} ${address.postalCode}
            </p>
            <h2>Total Amount</h2>
            <p><strong>₦${Number(order.totalAmount).toLocaleString()}</strong></p>
            <p>We will send tracking information once your order ships.</p>
          </div>
        `

        await resend.emails.send({
          from: 'orders@kensmadeit.com',
          to: order.customerEmail,
          subject: `Order Confirmation - ${order.orderNumber}`,
          html: emailHTML,
        })
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

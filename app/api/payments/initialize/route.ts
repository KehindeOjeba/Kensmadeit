import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PAYSTACK_API_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_API_URL = 'https://api.paystack.co'

export async function POST(request: NextRequest) {
	try {
		const { orderId, email, amount, reference } = await request.json()

		if (!orderId || !email || !amount || !reference) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
		}

		if (!PAYSTACK_API_KEY) {
			console.error('PAYSTACK_API_KEY not configured')
			return NextResponse.json({ error: 'Paystack API key not configured' }, { status: 500 })
		}

		// Verify order exists
		const order = await prisma.order.findUnique({ where: { id: orderId } })

		if (!order) {
			return NextResponse.json({ error: 'Order not found' }, { status: 404 })
		}

		// Initialize Paystack payment
		const paystackRes = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${PAYSTACK_API_KEY}`,
			},
			body: JSON.stringify({
				email,
				amount, // in kobo (smallest currency unit)
				reference,
				metadata: {
					orderId,
					orderNumber: order.orderNumber,
				},
			}),
		})

		const paystackData = await paystackRes.json().catch(() => null)

		if (!paystackRes.ok || !paystackData) {
			console.error('Paystack initialize error:', paystackData)
			return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
		}

		if (!paystackData.status) {
			return NextResponse.json({ error: paystackData.message || 'Failed to initialize payment' }, { status: 400 })
		}

		// Update order with payment reference
		await prisma.order.update({ where: { id: orderId }, data: { paymentReference: reference } })

		return NextResponse.json({
			authorizationUrl: paystackData.data.authorization_url,
			accessCode: paystackData.data.access_code,
			reference: paystackData.data.reference,
		})
	} catch (error) {
		console.error('Payment initialization error:', error)
		return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 })
	}
}

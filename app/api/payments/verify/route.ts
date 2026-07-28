import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PAYSTACK_API_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_API_URL = 'https://api.paystack.co'

export async function POST(request: NextRequest) {
	try {
		const { reference } = await request.json()

		if (!reference) {
			return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
		}

		if (!PAYSTACK_API_KEY) {
			console.error('PAYSTACK_API_KEY not configured')
			return NextResponse.json({ error: 'Paystack API key not configured' }, { status: 500 })
		}

		const verifyRes = await fetch(`${PAYSTACK_API_URL}/transaction/verify/${reference}`, {
			headers: {
				Authorization: `Bearer ${PAYSTACK_API_KEY}`,
			},
		})

		const verifyData = await verifyRes.json().catch(() => null)

		if (!verifyRes.ok || !verifyData) {
			console.error('Paystack verify error:', verifyData)
			return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
		}

		// Retrieve the order first, then perform all validation checks BEFORE any update
		const order = await prisma.order.findFirst({
			where: {
				paymentReference: reference,
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
			return NextResponse.json({ error: 'Order not found' }, { status: 404 })
		}

		try {
			// 1. Verify the payment status is "success"
			if (!verifyData.status || verifyData.data?.status !== 'success') {
				return NextResponse.json({ error: 'Payment was not successful' }, { status: 400 })
			}

			// 2. Verify the payment reference matches exactly
			if ((verifyData.data.reference ?? '') !== reference) {
				return NextResponse.json({ error: 'Payment reference mismatch' }, { status: 400 })
			}

			// 3. Verify the payment amount (Paystack amount is in kobo)
			const paystackAmount = Number(verifyData.data.amount)
const orderAmountKobo = Math.round(Number(order.totalAmount) * 100)

if (!Number.isFinite(paystackAmount)) {
	return NextResponse.json(
		{ error: "Invalid payment amount returned by Paystack" },
		{ status: 400 }
	)
}

if (paystackAmount !== orderAmountKobo) {
	return NextResponse.json(
		{ error: "Payment amount does not match order total" },
		{ status: 400 }
	)
}

			// 4. Verify the customer's email (case-insensitive)
			const paystackEmail = (verifyData.data?.customer?.email || '').toLowerCase()
			const orderEmail = (order.customerEmail || '').toLowerCase()
			if (paystackEmail !== orderEmail) {
				return NextResponse.json({ error: 'Customer email does not match order' }, { status: 400 })
			}

			// 5. Verify the currency
			if (verifyData.data?.currency !== 'NGN') {
				return NextResponse.json({ error: 'Invalid currency' }, { status: 400 })
			}

			// 6. Verify metadata exists and matches order id and number
			const metadata = verifyData.data?.metadata
			if (!metadata) {
				return NextResponse.json({ error: 'Missing payment metadata' }, { status: 400 })
			}

			if (String(metadata.orderId) !== String(order.id)) {
				return NextResponse.json({ error: 'Metadata orderId does not match' }, { status: 400 })
			}

			if (String(metadata.orderNumber) !== String(order.orderNumber)) {
				return NextResponse.json({ error: 'Metadata orderNumber does not match' }, { status: 400 })
			}

			// 7. All validations passed — perform the update inside a transaction
			const updatedOrder = await prisma.$transaction(async (tx) => {
				if (order.paymentStatus === "paid") {
		return order;
	}

	return await tx.order.update({
		where: { id: order.id },
		data: {
			paymentStatus: "paid",
			orderStatus: "processing",
		},
	});
			})

			// 9. Return minimal success response
			return NextResponse.json({
				success: true,
				orderId: updatedOrder.id,
				orderNumber: updatedOrder.orderNumber,
				paymentStatus: updatedOrder.paymentStatus,
			}, { status: 200 })
		} catch (validationError) {
			console.error('Payment validation/update error:', validationError)
			return NextResponse.json({ error: 'Payment validation failed' }, { status: 500 })
		}
	} catch (error) {
		console.error('Payment verification error:', error)
		return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
	}
}

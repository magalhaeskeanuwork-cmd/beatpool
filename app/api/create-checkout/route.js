import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { dealId, amount, requestTitle, producerUsername, stripeAccountId } = await req.json()

    const amountInCents = amount * 100
    const platformFee = Math.round(amountInCents * 0.20)

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Beat: ${requestTitle}`,
              description: `Produced by ${producerUsername}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/deal/success?dealId=${dealId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/deal?requestId=${dealId}`,
      metadata: { dealId },
    }

    if (stripeAccountId) {
      sessionConfig.payment_intent_data = {
        application_fee_amount: platformFee,
        transfer_data: { destination: stripeAccountId },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
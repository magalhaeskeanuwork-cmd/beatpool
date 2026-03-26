import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { producerId, email } = await req.json()

    const account = await stripe.accounts.create({
      type: 'express',
      email,
      metadata: { producerId },
    })

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?connect=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?connect=success`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url, accountId: account.id })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
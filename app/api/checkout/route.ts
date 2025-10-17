import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST() {
  try {
    // Sostituisci con il tuo price o crea gli items lato client
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.NEXT_PUBLIC_DEFAULT_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e:any) {
    return NextResponse.json({ error: e.message ?? "Stripe error" }, { status: 500 });
  }
}

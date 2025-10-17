import Stripe from "stripe";
import { NextResponse } from "next/server";

function need(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Variabile mancante: ${name}`);
  return v.trim();
}

export async function POST(req: Request) {
  try {
    const STRIPE_SECRET_KEY = need("STRIPE_SECRET_KEY");
    const STRIPE_PRICE_ID = need("STRIPE_PRICE_ID");
    const SUCCESS_URL = need("STRIPE_SUCCESS_URL");
    const CANCEL_URL = need("STRIPE_CANCEL_URL");

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const { quantity = 1 } = await req.json().catch(() => ({ quantity: 1 }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: STRIPE_PRICE_ID, quantity }],
      allow_promotion_codes: true,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      // ui_mode: "hosted" // (opzionale: ormai è default per Checkout)
    });

    if (!session.url) throw new Error("Stripe non ha restituito la URL della sessione.");
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("[Stripe] Errore creazione sessione:", e?.message || e);
    return NextResponse.json(
      { error: e?.message || "Impossibile creare la sessione di checkout" },
      { status: 400 }
    );
  }
}

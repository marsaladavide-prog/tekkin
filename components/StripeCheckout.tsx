"use client";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function StripeCheckout() {
  const handleClick = async () => {
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({
      lineItems: [{ price: "price_1SEA9p8lo3pV31aSOiZNQ15l", quantity: 1 }],
      mode: "payment",
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    });
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-full border border-blue-400 px-6 py-2 text-sm text-blue-300 transition hover:bg-blue-500/10"
    >
      Buy Sample Pack
    </button>
  );
}

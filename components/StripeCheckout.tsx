"use client";

type Props = { priceId?: string };

export default function StripeCheckout({ priceId }: Props) {
  async function handleCheckout() {
    // Se passi un priceId, puoi inviarlo in body e usarlo nella route
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url as string;
    } else {
      alert("Checkout error");
      console.error(data);
    }
  }

  return (
    <button className="btn" onClick={handleCheckout}>
      Vai al Checkout
    </button>
  );
}

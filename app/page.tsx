import StripeCheckout from "@/components/StripeCheckout";
import AudioPlayer from "@/components/AudioPlayer";

export default function Home() {
  return (
    <div className="card" style={{ display:"grid", gap:24 }}>
      <h1 className="gradText" style={{ fontSize:32, fontWeight:800 }}>Tekkin Core</h1>
      <p>Base solida per mantenere una linea unica in tutto il sito.</p>

      <div style={{ display:"grid", gap:16 }}>
        <h3>Audio Player</h3>
        <AudioPlayer
          src="/demo.mp3"
          title="Demo Tekkin"
          accentA="var(--grad1)"
          accentB="var(--grad2)"
        />
      </div>

      <div style={{ display:"grid", gap:12 }}>
        <h3>Checkout</h3>
        <StripeCheckout priceId="price_test_or_product" />
        <small className="link">Configura PRICE_ID nel route API se preferisci.</small>
      </div>
    </div>
  );
}

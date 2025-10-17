import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="min-h-[60vh] grid place-items-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-semibold text-zinc-100">Pagamento annullato ⚠️</h1>
        <p className="mt-3 text-zinc-400">
          Nessun addebito è stato effettuato. Puoi riprovare quando vuoi.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/?view=product" className="rounded-md px-4 py-2 bg-[#43FFD2] text-black hover:bg-[#2fe8be]">
            Torna al Checkout
          </Link>
          <Link href="/" className="rounded-md px-4 py-2 border border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
            Torna alla Home
          </Link>
        </div>
      </div>
    </main>
  );
}

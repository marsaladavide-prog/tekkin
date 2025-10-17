"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <main className="min-h-[60vh] grid place-items-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-semibold text-zinc-100">Pagamento riuscito ✅</h1>
        <p className="mt-3 text-zinc-400">
          Grazie per l’acquisto! Ti abbiamo inviato una mail con i dettagli.
          {sessionId ? (
            <> <br/>ID sessione: <span className="text-zinc-300">{sessionId}</span></>
          ) : null}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="rounded-md px-4 py-2 bg-[#43FFD2] text-black hover:bg-[#2fe8be]">
            Torna alla Home
          </Link>
          <Link href="/?view=dashboard" className="rounded-md px-4 py-2 border border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800">
            Vai alla Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

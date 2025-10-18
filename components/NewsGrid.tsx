'use client'
import { useEffect, useState } from 'react'

export default function NewsGrid({
  categoria = 'produzione',
}: {
  categoria?: 'produzione' | 'promozione' | 'eventi'
}) {
  const [news, setNews] = useState<any[]>([])

  const traduzioneCategoria: Record<string, string> = {
    produzione: 'production',
    promozione: 'promotion',
    eventi: 'events',
  }

  const titoloCategoria: Record<string, string> = {
    produzione: 'Produzione e strumenti',
    promozione: 'Promozione e label',
    eventi: 'Eventi e festival',
  }

  useEffect(() => {
    const caricaNews = async () => {
      try {
        const res = await fetch(`/api/news?category=${traduzioneCategoria[categoria]}&limit=3`)
        const data = await res.json()
        setNews(data.items || [])
      } catch (e) {
        console.error('Errore nel caricamento delle news:', e)
      }
    }
    caricaNews()
  }, [categoria])

  if (!news.length) return null

  return (
    <section className="my-12">
      <h2 className="text-xl font-semibold mb-4 text-zinc-100">
        {titoloCategoria[categoria]}
      </h2>

      {/* --- BLOCCO ORIZZONTALE --- */}
      <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#43FFD2]/60 scrollbar-track-transparent">
        {news.map((item) => (
          <div
            key={item.url}
            className="snap-start min-w-[260px] max-w-[260px] flex-shrink-0 bg-[#121212] border border-[#222] rounded-xl overflow-hidden hover:border-[#43FFD2]/30 transition-all duration-300"
          >
            {/* FOTO */}
            <div className="h-[150px] w-full overflow-hidden">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full bg-[#1a1a1a] flex items-center justify-center text-xs text-zinc-500">
                  Nessuna immagine
                </div>
              )}
            </div>

            {/* TESTO */}
            <div className="p-3 h-[140px] flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                {item.title.replaceAll('&amp;', '&').replaceAll('&#038;', '&')}
              </h3>

              {item.summary && (
                <p className="text-xs text-zinc-400 line-clamp-3 mt-2">
                  {item.summary
                    .replace(/&#\d+;|&[a-z]+;/g, '')
                    .replaceAll('Read more', '')
                    .replaceAll('Click here', '')
                    .trim()}
                </p>
              )}

              <div className="text-[11px] text-zinc-500 mt-3">
                Fonte: <span className="text-[#43FFD2]">{item.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

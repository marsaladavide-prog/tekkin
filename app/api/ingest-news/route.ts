import { NextResponse } from 'next/server'
import { SOURCES } from '@/lib/news/sources'
import { fetchFeed, pickImage, parseDate } from '@/lib/news/fetchRss'
import { sbAdmin } from '@/lib/supabaseAdmin'

// Forziamo runtime Node.js per permettere fetch lato server
export const runtime = 'nodejs'

export async function GET() {
  const results: any[] = []

  for (const src of SOURCES) {
    try {
      const items = await fetchFeed(src.url)
      for (const it of items.slice(0, 20)) {
        const url = it.link
        if (!url) continue
        const { error } = await sbAdmin
          .from('news')
          .upsert(
            {
              url,
              title: it.title?.trim() || 'Untitled',
              source: src.name,
              category: src.category,
              summary: (it.contentSnippet || it.content || '').slice(0, 350),
              image_url: pickImage(it.content, it.enclosure?.url),
              published_at: parseDate(it),
            },
            { onConflict: 'url' }
          )
        if (error) throw error
      }
      results.push({ source: src.name, status: 'ok' })
    } catch (e: any) {
      results.push({ source: src.name, status: 'error', message: e?.message })
    }
  }

  return NextResponse.json({ results })
}

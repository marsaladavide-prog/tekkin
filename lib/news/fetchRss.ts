import Parser from 'rss-parser'

export type RssItem = {
  title: string
  link: string
  isoDate?: string
  pubDate?: string
  contentSnippet?: string
  content?: string
  enclosure?: { url?: string }
}

export async function fetchFeed(feedUrl: string) {
  const parser = new Parser({
    timeout: 20000,
    headers: {
      'user-agent': 'TekkinBot/1.0 (+https://tekkin.it)',
    },
  })

  const res = await fetch(feedUrl)
  const raw = await res.text()

  // Pulisce caratteri XML illegali e simboli strani
  const clean = raw
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')

  try {
    const feed = await parser.parseString(clean)
    return feed.items as RssItem[]
  } catch (err) {
    console.error('Parser error on', feedUrl, err)
    return []
  }
}

export function pickImage(html?: string, enclosureUrl?: string): string | undefined {
  if (enclosureUrl) return enclosureUrl
  if (!html) return undefined
  const m = html.match(/<img[^>]+src=[\"']([^\"']+)/i)
  return m?.[1]
}

export function parseDate(item: RssItem): string {
  return item.isoDate || item.pubDate || new Date().toISOString()
}

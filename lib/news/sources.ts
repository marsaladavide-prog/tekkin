export type Source = {
  name: string
  url: string
  category: 'events' | 'promotion' | 'production'
}

export const SOURCES = [
  {
    name: 'MusicTech',
    url: 'https://musictech.com/feed/',
    category: 'production',
  },
  {
    name: 'Rekkerd',
    url: 'http://feeds.feedburner.com/rekkerd',
    category: 'production',
  },
  {
    name: 'Sound On Sound — News',
    url: 'https://www.soundonsound.com/news/rss.xml',
    category: 'production',
  },
  {
    name: 'MusicRadar — Tech',
    url: 'https://www.musicradar.com/feeds/news/tech',
    category: 'production',
  },
  {
    name: 'Hypebot',
    url: 'https://feeds.feedburner.com/hypebot',
    category: 'promotion',
  },
  {
    name: 'DJ Mag — News & Events',
    url: 'https://djmag.com/rss.xml',
    category: 'events',
  },
]

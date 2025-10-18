import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 300 // 5 minuti cache ISR

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const cat = (url.searchParams.get('category') || 'production') as 'events' | 'promotion' | 'production'
  const limit = Number(url.searchParams.get('limit') || 3)

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await sb
    .from('news')
    .select('*')
    .eq('category', cat)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data })
}

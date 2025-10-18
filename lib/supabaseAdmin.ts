import { createClient } from '@supabase/supabase-js'

// URL e chiave service role dalle variabili d'ambiente
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE!

export const sbAdmin = createClient(url, key, {
  auth: { persistSession: false },
})

// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Read Vite-exposed envs (must start with VITE_ for the browser build!)
const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url) {
  throw new Error('VITE_SUPABASE_URL is missing. Set it in Vercel envs.')
}
if (!anon) {
  throw new Error('VITE_SUPABASE_ANON_KEY is missing. Set it in Vercel envs.')
}

// Single shared client used across the app
export const supabase = createClient(url, anon, {
  // keep it simple; we don’t rely on auth right now
  auth: { persistSession: false, autoRefreshToken: false },
})

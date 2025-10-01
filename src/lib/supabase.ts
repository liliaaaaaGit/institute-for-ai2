// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Read Vite-exposed envs with fallbacks for debugging
const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

// More graceful error handling for debugging
if (!url || !anon) {
  console.error('Missing Supabase environment variables:', {
    VITE_SUPABASE_URL: url ? 'SET' : 'MISSING',
    VITE_SUPABASE_ANON_KEY: anon ? 'SET' : 'MISSING',
    allEnvVars: import.meta.env
  })
}

// Create client only if we have the required variables
export const supabase = url && anon ? createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
}) : null

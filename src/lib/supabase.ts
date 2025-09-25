import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL!
const key = import.meta.env.VITE_SUPABASE_ANON_KEY!
export const supabase = createClient(url, key, {
  auth: {
    persistSession: false,          // we don't use auth here; avoids storage writes
    storageKey: 'ai2-app-auth'      // unique key if you ever enable auth
  }
})
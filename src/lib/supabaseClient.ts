import { createClient } from '@supabase/supabase-js'

// Fallback to NEXT_PUBLIC_ prefixed variables if VITE_ ones are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

const isValidConfig = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'

if (!isValidConfig) {
  console.error('Missing Supabase environment variables. Please ensure you have either:')
  console.error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  console.error('or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('in your .env file')
  console.warn('Using placeholder values - some features may not work')
}

export const supabase = isValidConfig ? createClient(
  supabaseUrl,
  supabaseAnonKey
) : null
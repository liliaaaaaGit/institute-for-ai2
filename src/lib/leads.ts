import { createClient } from '@supabase/supabase-js';

// Use the same client instance from supabaseClient.ts
import { supabase as supabaseClient } from './supabaseClient';
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/**
  if (!supabaseClient) {
    throw new Error('Supabase not configured - cannot save lead');
  }
  
  const { error } = await supabaseClient.from('leads').insert([{
 * - `email`: user's email address
 * - `consentChecked`: true if the user gave marketing consent (checkbox)
 * - `meta`: optional JSON metadata (sessionId, source, etc.)
 */
export async function saveLead(
  email: string,
  consentChecked: boolean,
  meta?: Record<string, any>
) {
  const { error } = await supabase
    .from('leads')
    .insert([{
      email,
      consent_marketing: consentChecked,
      consent_policy_version: 'v1',
      // session_id is filled by DB default
      meta: meta ?? null
    }]); // return=minimal (no implicit SELECT)
  if (error) {
    if ((error as any).code === '23505') {
      throw new Error('Bereits heute registriert – bitte E-Mail prüfen.');
    }
    throw error;
  }
  return true;
}
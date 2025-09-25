// src/lib/leads.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL!;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY!;
if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}
const supabase = createClient(url, key);

/** One row per email; safe upsert; no .select(); ignore duplicates */
export async function upsertLead(
  email: string,
  consentChecked: boolean,
  meta?: Record<string, any>
) {
  const normalized = email.trim().toLowerCase();
  try {
    const { error } = await supabase
      .from('leads')
      .upsert(
        {
          email: normalized,
          consent_marketing: consentChecked,      // must be true or RLS blocks
          consent_policy_version: 'v1',
          meta: meta ?? null,
        },
        { onConflict: 'email', ignoreDuplicates: true }
      );
    if (error) throw error;
    return true;
  } catch (e: any) {
    const msg = String(e?.message || '');
    if (e?.code === '23505' || /duplicate|unique|409/i.test(msg)) return true;
    throw e;
  }
}

export async function logLeadEvent(params: {
  email: string;
  sessionId?: string;
  model?: string;
  tokens?: number;
  co2_grams?: number;
  public_slug?: string;
  meta?: Record<string, any>;
}) {
  const { email, sessionId, model, tokens, co2_grams, public_slug, meta } = params;
  const { error } = await supabase.from('lead_events').insert([{
    email: email.trim().toLowerCase(),
    session_id: sessionId || undefined,
    model, tokens, co2_grams, public_slug,
    meta: meta ?? null,
  }]);
  if (error) throw error;
  return true;
}

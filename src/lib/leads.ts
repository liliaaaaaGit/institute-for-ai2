// src/lib/leads.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/**
 * Single, RLS-safe write path for the leads table.
 * - Upsert by email
 * - Ignore duplicates (no 409)
 * - No .select() to avoid 406 issues
 */
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
          consent_marketing: consentChecked, // RLS requires true
          consent_policy_version: 'v1',
          meta: meta ?? null,
        },
        { onConflict: 'email', ignoreDuplicates: true } // prevents 409
      ); // do NOT chain .select()

    if (error) throw error;
    return true;
  } catch (e: any) {
    // In case some old code still does a plain INSERT: treat 23505/409 as success
    const msg = String(e?.message || '');
    if (e?.code === '23505' || /unique|duplicate|409/i.test(msg)) return true;
    throw e;
  }
}

/**
 * Optional: log each send attempt to lead_events.
 */
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

  const { error } = await supabase
    .from('lead_events')
    .insert([{
      email: email.trim().toLowerCase(),
      session_id: sessionId || undefined, // table default will fill if present
      model,
      tokens,
      co2_grams,
      public_slug,
      meta: meta ?? null,
    }]);

  if (error) throw error;
  return true;
}

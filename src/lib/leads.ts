// src/lib/leads.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/** Ensure one row per email in `leads` (idempotent). */
export async function upsertLead(
  email: string,
  consentChecked: boolean,
  meta?: Record<string, any>
) {
  const { error } = await supabase
    .from('leads')
    .upsert(
      {
        email,
        consent_marketing: consentChecked,
        consent_policy_version: 'v1',
        meta: meta ?? null,
      },
      { onConflict: 'email' } // <- per-email uniqueness
    );

  if (error) throw error;
  return true;
}

/** Log every user request/send (unlimited per day). */
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
    .insert([
      {
        email,
        session_id: sessionId || undefined, // DB default if omitted
        model,
        tokens,
        co2_grams,
        public_slug,
        meta: meta ?? null,
      },
    ]);

  if (error) throw error;
  return true;
}
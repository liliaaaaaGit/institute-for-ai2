// src/lib/leads.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export async function upsertLead(
  email: string,
  consentChecked: boolean,
  meta?: Record<string, any>
) {
  const normalized = email.trim().toLowerCase();
  // ✅ One-shot UPSERT. No pre-SELECT. No .select() (RLS blocks SELECT).
  const { error } = await supabase
    .from('leads')
    .upsert(
      {
        email: normalized,
        consent_marketing: consentChecked,
        consent_policy_version: 'v1',
        meta: meta ?? null,
      },
      { onConflict: 'email' }
    );
  if (error) throw error;
  return true;
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

  const { error } = await supabase
    .from('lead_events')
    .insert([{
      email: email.trim().toLowerCase(),
      session_id: sessionId || undefined,
      model,
      tokens,
      co2_grams,
      public_slug,
      meta: meta ?? null,
    }]);

  if (error) throw error;
  return true;
}
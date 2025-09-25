// src/lib/leads.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// ✅ One-write lead save: INSERT with onConflict + ignoreDuplicates (no SELECT, no UPDATE)
export async function upsertLead(
  email: string,
  consentChecked: boolean,
  meta?: Record<string, any>
) {
  const normalized = email.trim().toLowerCase();
  const { error } = await supabase
    .from('leads')
    .insert(
      {
        email: normalized,
        consent_marketing: consentChecked,
        consent_policy_version: 'v1',
        meta: meta ?? null,
      },
      // Only INSERT; if the email exists, ignore it silently.
      { onConflict: 'email', ignoreDuplicates: true }
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
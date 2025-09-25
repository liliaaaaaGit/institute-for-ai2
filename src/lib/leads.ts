// src/lib/leads.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL!;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Harte Guards – ohne diese zwei Variablen funktioniert der Client nicht
if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Browser-Client
const supabase = createClient(url, key); // keep for reads if needed

// TEMP DEBUG – nach erfolgreichem Test wieder entfernen
console.log('[SUPA ENV]', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY_HEAD: import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 12),
  VERCEL_ENV: import.meta.env.VERCEL_ENV,
});

/**
 * Idempotentes Upsert:
 * - genau eine Zeile je Email
 * - kein .select() anhängen (vermeidet 406)
 * - onConflict=email + ignoreDuplicates vermeidet 409
 * - consent_marketing muss true sein, sonst blockt RLS
 */
export async function upsertLead(
  email: string,
  consentChecked: boolean,
  meta?: Record<string, any>
) {
  const r = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      consent_marketing: !!consentChecked,
      consent_policy_version: 'v1',
      meta: meta ?? null,
    }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.error || `Lead upsert failed (${r.status})`);
  }
  return true;
}

/**
 * Ereignis-Logging in eigenes Event-Table.
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

  const { error } = await supabase.from('lead_events').insert([
    {
      email: email.trim().toLowerCase(),
      session_id: sessionId || undefined,
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

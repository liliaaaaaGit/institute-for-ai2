// src/lib/leads.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL!;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Harte Guards – ohne diese zwei Variablen funktioniert der Client nicht
if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Browser-Client
const supabase = createClient(url, key);

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
  const normalized = email.trim().toLowerCase();

  try {
    const { error } = await supabase
      .from('leads')
      .upsert(
        {
          email: normalized,
          consent_marketing: consentChecked,      // RLS verlangt true
          consent_policy_version: 'v1',
          meta: meta ?? null,
        },
        { onConflict: 'email', ignoreDuplicates: true }
      ); // WICHTIG: kein .select()

    if (error) throw error;
    return true;
  } catch (e: any) {
    const msg = String(e?.message || '');
    // doppelte Keys/409 sind hier ok (idempotent)
    if (e?.code === '23505' || /duplicate|unique|409/i.test(msg)) return true;
    throw e;
  }
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

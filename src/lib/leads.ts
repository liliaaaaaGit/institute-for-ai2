// src/lib/leads.ts
import { supabase } from './supabase'

// ——— TEMP DEBUG: remove once verified in prod ———
console.log('[SUPA ENV]', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY_HEAD: import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 12),
  VERCEL_ENV: import.meta.env.VERCEL_ENV,
})

/**
 * Idempotent lead write
 * - exactly one row per email in public.leads
 * - handled on the server (/api/leads) to use the service role & pass RLS
 * - no client-side SELECT to avoid 406
 * - uses onConflict=email + ignoreDuplicates (server) to avoid 409
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
      consent_marketing: !!consentChecked, // must be true or RLS blocks
      consent_policy_version: 'v1',
      meta: meta ?? null,
    }),
  })

  if (!r.ok) {
    const j = await r.json().catch(() => ({}))
    throw new Error(j?.error || `Lead upsert failed (${r.status})`)
  }
  return true
}

/**
 * Event logging into public.lead_events.
 * NOTE: DB column session_id is UUID. If we have a non-UUID (e.g. "calc_..."),
 * we store it in meta.session_key instead and omit session_id.
 */
export async function logLeadEvent(params: {
  email: string
  sessionId?: string // may be non-UUID like "calc_..."
  model?: string
  tokens?: number
  co2_grams?: number
  public_slug?: string
  meta?: Record<string, any>
}) {
  const { email, sessionId, model, tokens, co2_grams, public_slug } = params
  const baseMeta = params.meta ?? {}

  // UUID v4 matcher (good enough for pre-insert validation)
  const isUuid = (s?: string) =>
    !!s &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)

  // Build payload; only include session_id if it’s a valid UUID
  const payload: Record<string, any> = {
    email: email.trim().toLowerCase(),
    model,
    tokens,
    co2_grams,
    public_slug,
    meta: isUuid(sessionId) ? baseMeta : { ...baseMeta, session_key: sessionId },
  }
  if (isUuid(sessionId)) {
    payload.session_id = sessionId
  }

  const { error } = await supabase.from('lead_events').insert([payload])
  if (error) throw error
  return true
}

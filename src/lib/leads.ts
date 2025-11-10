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
 * - uses onConflict=email on the server to avoid 409
 */
export async function upsertLead(
  email: string,
  consentMarketing: boolean,              // ← checkbox 2 (newsletter)
  meta?: Record<string, any>
) {
  const r = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      consent_marketing: !!consentMarketing,        // ← store exactly what the user chose
      consent_policy_version: 'v1',
      meta: { ...(meta ?? {}), newsletter: !!consentMarketing }, // helpful for audits
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
  sessionId?: string
  model?: string
  tokens?: number
  co2_grams?: number
  public_slug?: string
  meta?: Record<string, any>
}) {
  const r = await fetch('/api/log-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: params.email.trim().toLowerCase(),
      // we don’t force UUID here; server can accept text/null
      session_id: undefined, // keep null unless you send a real uuid
      model: params.model,
      tokens: params.tokens,
      co2_grams: params.co2_grams,
      public_slug: params.public_slug,
      meta: { ...(params.meta ?? {}), session_key: params.sessionId }, // store non-UUID session in meta
    }),
  })
  if (!r.ok) {
    const j = await r.json().catch(() => ({}))
    throw new Error(j?.error || `logLeadEvent failed (${r.status})`)
  }
  return true
}

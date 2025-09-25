// /api/leads.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { email, consent_marketing, consent_policy_version, meta } = req.body ?? {}
    if (!email || !consent_marketing) {
      return res.status(400).json({ error: 'Missing email or consent_marketing' })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Idempotent lead
    const { error: upsertErr } = await supabase
      .from('leads')
      .upsert({
        email: String(email).trim().toLowerCase(),
        consent_marketing: true,
        consent_policy_version: consent_policy_version ?? 'v1',
        meta: meta ?? null,
      }, { onConflict: 'email', ignoreDuplicates: true })

    if (upsertErr) return res.status(500).json({ error: upsertErr.message })

    // Optional: log event
    await supabase.from('lead_events').insert([{
      email: String(email).trim().toLowerCase(),
      meta: meta ?? null,
    }])

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
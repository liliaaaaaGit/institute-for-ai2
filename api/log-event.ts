// /api/log-event.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = (typeof req.body === 'string') ? JSON.parse(req.body) : req.body
    const { email, session_id, model, tokens, co2_grams, public_slug, meta } = body ?? {}
    if (!email) return res.status(400).json({ error: 'Missing email' })

    const { error } = await supabase.from('lead_events').insert([{
      email: String(email).trim().toLowerCase(),
      session_id: session_id ?? null,
      model: model ?? null,
      tokens: tokens ?? null,
      co2_grams: co2_grams ?? null,
      public_slug: public_slug ?? null,
      meta: meta ?? null,
    }])
    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}

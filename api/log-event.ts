// /api/log-event.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

function isUuid(s?: string) {
  return !!s && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Guard required server envs
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' })
  }

  // Parse body safely (Vercel may give string or object)
  let body: any
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const { email, session_id, model, tokens, co2_grams, public_slug, meta } = body
  if (!email) return res.status(400).json({ error: 'Missing email' })

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Build row; only include session_id if it’s a valid UUID
    const row: Record<string, any> = {
      email: String(email).trim().toLowerCase(),
      model: model ?? null,
      tokens: typeof tokens === 'number' ? tokens : null,
      co2_grams: typeof co2_grams === 'number' ? co2_grams : null,
      public_slug: public_slug ?? null,
      meta: meta ?? null,
    }
    if (isUuid(session_id)) {
      row.session_id = session_id
    }
    // else: omit session_id → DB default (gen_random_uuid()) fills it if configured;
    //       otherwise ensure the column is nullable.

    const { error } = await supabase.from('lead_events').insert([row])
    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}

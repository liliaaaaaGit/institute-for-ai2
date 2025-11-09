// /api/leads.ts  (Vercel serverless function at repo root)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing Supabase environment variables:', {
    SUPABASE_URL: SUPABASE_URL ? 'SET' : 'MISSING',
    SERVICE_ROLE: SERVICE_ROLE ? 'SET' : 'MISSING'
  });
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

function isEmail(v: unknown) {
  return typeof v === 'string' && /^\S+@\S+\.\S+$/.test(v.trim());
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  console.log('Leads API called with method:', req.method);
  console.log('Request body type:', typeof req.body);

  try {
    // Body might be string or object depending on framework
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    console.log('Parsed body:', body);

    const {
      email,
      // accept both old and new client props
      newsletter,
      consent_marketing,
      policyVersion,
      consent_policy_version,
      meta = {},
    } = body;

    if (!isEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    
    console.log('Processing lead for email:', email);

    // Respect client's choice. Default = report-only (false).
    const marketing: boolean =
      typeof newsletter === 'boolean'
        ? newsletter
        : typeof consent_marketing === 'boolean'
        ? consent_marketing
        : false;

    const pv = policyVersion ?? consent_policy_version ?? 'v1';

    console.log('Upserting lead with marketing consent:', marketing);

    // Single row per email (unique index on leads.email)
    const { error: upsertErr } = await supabase
      .from('leads')
      .upsert(
        {
          email: String(email).trim().toLowerCase(),
          consent_marketing: marketing,              // ← write exact flag
          consent_policy_version: pv,
          meta,
        },
        { onConflict: 'email' }                      // idempotent
      );

    if (upsertErr) {
      console.error('Supabase upsert error:', upsertErr);
      return res.status(500).json({ error: upsertErr.message });
    }

    console.log('Lead upserted successfully');

    // Optional: best-effort event log (won’t break the response if it fails)
    await supabase.from('lead_events').insert([
      {
        email: String(email).trim().toLowerCase(),
        meta: { ...meta, event: 'report_requested', newsletter: marketing },
      },
    ]).then(() => {}).catch(() => {});
    
    console.log('Lead event logged');

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('/api/leads error:', e?.message || e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

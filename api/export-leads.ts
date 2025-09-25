// api/export-leads.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }
  const auth = req.headers.authorization ?? '';
  const token = process.env.ADMIN_EXPORT_TOKEN;
  if (!token || auth !== `Bearer ${token}`) return res.status(401).send('Unauthorized');

  const url = process.env.VITE_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) return res.status(500).send('Supabase env missing');

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('leads')
    .select('email, consent_marketing, created_at, confirmation_token')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).send(error.message);

  const rows = [
    ['email', 'consent', 'created_at', 'meta'].join(','),
    ...(data ?? []).map(r => [
      `"${r.email.replace(/"/g,'""')}"`,
      String(r.consent_marketing),
      r.created_at,
      `"${JSON.stringify({ token: r.confirmation_token }).replace(/"/g,'""')}"`,
    ].join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  return res.status(200).send(rows);
}
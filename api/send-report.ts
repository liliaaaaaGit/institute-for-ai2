import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.FROM_EMAIL!;
const REPLY_TO = process.env.REPLY_TO;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { to, subject, html_report, text_report } = req.body ?? {};
    if (!to || !/.+@.+\..+/.test(to)) return res.status(400).json({ error: 'Invalid email' });
    if (!html_report && !text_report) return res.status(400).json({ error: 'Missing content' });

    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: subject ?? 'Dein KI-CO₂-Bericht',
      html: html_report ?? undefined,
      text: text_report ?? undefined,
      reply_to: REPLY_TO ?? undefined,
    });

    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('send-report error', e);
    return res.status(500).json({ error: 'Email send failed' });
  }
}
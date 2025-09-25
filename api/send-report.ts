import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { to, subject, html } = (req.body ?? {}) as {
      to?: string | string[];
      subject?: string;
      html?: string;
    };

    if (!to) return res.status(400).json({ error: 'Missing "to"' });

    const sendResult = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Institute for AI Austria <onboarding@resend.dev>',
      to,
      subject: subject || 'CO₂ Report',
      html: html || '<p>Hello from Vercel + Resend</p>',
      reply_to: process.env.REPLY_TO,
    });

    res.status(200).json({ ok: true, data: sendResult });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'Unknown error' });
  }
}
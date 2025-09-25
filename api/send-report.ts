import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { CreateEmailOptions } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html } = req.body || {};

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }

    const from = process.env.FROM_EMAIL || 'Institute for AI Austria <onboarding@resend.dev>';

    const mail: CreateEmailOptions = {
      from,
      to, // string or string[]
      subject,
      html,
      ...(process.env.REPLY_TO ? { replyTo: process.env.REPLY_TO } : {}),
    };

    const result = await resend.emails.send(mail);
    return res.status(200).json({ ok: true, id: result?.data?.id ?? null });
  } catch (err: any) {
    console.error('Email send error:', err);
    return res.status(500).json({ ok: false, error: err?.message ?? 'Unknown error' });
  }
}
// api/send-report.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TEST_ALLOWED_TO = process.env.RESEND_TEST_ALLOWED_TO; // set to your own address in Vercel
const FROM = process.env.FROM_EMAIL;           // e.g. "Institute for AI Austria <onboarding@resend.dev>"
const REPLY_TO = process.env.REPLY_TO || undefined; // optional

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    let { to, subject, html, replyTo } = (req.body ?? {}) as {
      to?: string | string[]; subject?: string; html?: string; replyTo?: string;
    };

    if (!to || !subject || !html) {
      return res.status(400).json({ ok: false, error: 'Missing required fields: to, subject, html' });
    }

    // Only reroute in development/test environments, not production
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
    
    if (!isProd && TEST_ALLOWED_TO && to.toLowerCase() !== TEST_ALLOWED_TO.toLowerCase()) {
      const originalTo = to;
      to = TEST_ALLOWED_TO;
      subject = `[Test rerouted from ${originalTo}] ${subject}`;
      html = `<p style="font:14px/1.4 -apple-system,Segoe UI,Roboto,Arial;background:#fff3cd;padding:8px;border:1px solid #ffeaa7;margin-bottom:16px;">` +
             `<strong>🧪 Test Mode:</strong> Original recipient was <code>${originalTo}</code></p>` + html;
    }

    if (!FROM) {
      return res.status(500).json({ ok: false, error: 'FROM_EMAIL missing on server' });
    }

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: replyTo ?? REPLY_TO,
    });

    if (error) return res.status(502).json({ ok: false, error: error.message ?? 'Email send failed' });
    return res.status(200).json({ ok: true, id: data?.id ?? null });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? 'Unexpected error' });
  }
}
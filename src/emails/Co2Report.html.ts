// /api/send-co2-report.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import EmailTemplate from "../src/emails/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Absender über eure verifizierte Resend-Domain:
const FROM = 'Institute for AI Austria <co2@reports.institute-for-ai.com>';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const {
      to,                 // Empfänger-Mail
      model,
      co2,
      tokens,
      pcMinutes,
      carMeters,
      householdMinutes,
      phoneCharges,
      ledHours,
    } = body ?? {};

    if (!to) return res.status(400).json({ error: "Missing 'to' address" });

    const subject = `Ihr CO₂-Bericht – ${model || "GPT-4"}`;

    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      react: EmailTemplate({
        model,
        co2,
        tokens,
        pcMinutes,
        carMeters,
        householdMinutes,
        phoneCharges,
        ledHours,
      }) as React.ReactElement,
    });

    if (error) return res.status(500).json({ error: error.message || String(error) });
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}

import { Resend } from 'resend';
import { renderReportHtml, renderReportText } from '../emails/reportTemplates';
import { EmailReportInput } from '../types/email';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.FROM_EMAIL!;

export async function sendCo2ReportEmail(payload: EmailReportInput) {
  const html = renderReportHtml(payload);
  const text = renderReportText(payload);

  const subject = `Dein KI-CO₂-Bericht — ${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(payload.co2Grams)} g CO₂ für ${new Intl.NumberFormat('de-DE').format(payload.tokens)} Tokens (${payload.modelName})`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: payload.to,
    subject,
    html,
    text,
  });

  if (error) throw error;
}
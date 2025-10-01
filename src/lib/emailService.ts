// src/lib/emailService.ts
export async function sendReport(to: string, subject: string, html: string, replyTo?: string) {
  console.log('🚀 Sending email to:', to);
  console.log('📧 Subject:', subject);
  console.log('🌍 Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    isProd: process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
  });
  
  const res = await fetch('/api/send-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html, replyTo }),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('❌ Email send failed:', err);
    throw new Error(err?.error ?? `E-Mail failed (${res.status})`);
  }
  
  const result = await res.json() as { ok: boolean; id: string | null };
  console.log('✅ Email sent successfully:', result);
  return result;
}

// Legacy function for backward compatibility - will be removed after refactoring
export async function sendEmailReport(email: string, reportData: any): Promise<void> {
  console.warn('sendEmailReport is deprecated, use sendReport instead');
  
  // Import the template function
  const { co2EmailHtml } = await import('../emails/Co2Report.html');
  
  const subject = `Ihr CO₂-Bericht – ${reportData?.model?.name ?? 'AI Model'}`;
  const html = co2EmailHtml({
    resultGrams: reportData.co2Grams,
    model: reportData.model?.name ?? String(reportData.model),
    tokens: reportData.tokens,
    prompt: reportData.originalPrompt,
    comparisons: reportData.comparisons ?? [],
  });
  
  await sendReport(email, subject, html);
}
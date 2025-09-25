// src/emails/Co2Report.html.ts
export function co2EmailHtml(params: {
  resultGrams: number;
  model: string;
  tokens?: number;
  prompt?: string;
  comparisons: Array<{ label: string; value: string }>;
}) {
  const { resultGrams, model, tokens, prompt, comparisons } = params;
  const fmt = new Intl.NumberFormat('de-DE');
  const cmpRows = comparisons.map(c => `
    <tr>
      <td style="padding:8px 0;color:#111;font-size:14px;">${c.label}</td>
      <td style="padding:8px 0;color:#111;font-size:14px;text-align:right;">${c.value}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CO₂-Bericht</title>
</head><body style="margin:0;background:#f6f7f9;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;">
<tr><td align="center" style="padding:24px;">
  <table width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fff;border-radius:12px;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <tr><td style="font-size:20px;font-weight:700;color:#111;">CO₂-Bericht für Ihren Prompt</td></tr>
    <tr><td style="height:12px;"></td></tr>
    <tr><td style="font-size:14px;color:#444;line-height:1.6;">
      <strong>Zusammenfassung</strong><br>
      Geschätzter CO₂-Ausstoß: <strong>${fmt.format(resultGrams)} g CO₂</strong>
      (Modell: <strong>${model}</strong>${tokens ? `, Tokens: <strong>${fmt.format(tokens)}</strong>` : ''}).
    </td></tr>
    <tr><td style="height:16px;"></td></tr>
    <tr><td style="font-size:14px;color:#444;line-height:1.6;">
      <strong>Ihre Eingaben</strong><br>
      ${prompt ? `<div style="margin-top:6px;padding:12px;background:#fafafa;border:1px solid #eee;border-radius:8px;white-space:pre-wrap;">${prompt.replace(/</g,'&lt;')}</div>` : ''}
      <div style="margin-top:8px;">Model: ${model}${tokens ? ` • Tokens: ${fmt.format(tokens)}` : ''}</div>
    </td></tr>
    <tr><td style="height:16px;"></td></tr>
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr><td colspan="2" style="font-size:14px;color:#444;"><strong>Alltagsvergleiche</strong></td></tr>
        ${cmpRows}
      </table>
    </td></tr>
    <tr><td style="height:16px;"></td></tr>
    <tr><td style="font-size:14px;color:#444;line-height:1.6;">
      <strong>Tipps zur Reduktion</strong>
      <ul style="margin:8px 0 0 18px;padding:0;">
        <li>Kürzere Prompts / Antwortlängen begrenzen (Tokens reduzieren).</li>
        <li>Leichtere Modelle wählen, wenn ausreichend.</li>
        <li>Batching & Caching nutzen; unnötige Re-Runs vermeiden.</li>
        <li>Bei Bild/Video: Auflösung/Steps konservativ wählen.</li>
      </ul>
    </td></tr>
    <tr><td style="height:16px;"></td></tr>
    <tr><td style="font-size:12px;color:#777;line-height:1.6;">
      <strong>Datenschutzhinweis</strong><br>
      Sie erhalten diese E-Mail, weil Sie dem Versand eines CO₂-Berichts zugestimmt haben.
      Abbestellen: Antworten Sie mit „Unsubscribe". Details siehe Datenschutzhinweise auf der Website.
    </td></tr>
  </table>
  <div style="font-family:Arial,Helvetica,sans-serif;color:#9aa0a6;font-size:12px;margin-top:12px;">© Institute for AI Austria</div>
</td></tr></table>
</body></html>`;
}
import { nf1, nf0 } from '../lib/intl';
import { EmailReportInput } from '../types/email';

export function renderReportText(d: EmailReportInput) {
  const co2 = `${nf1.format(d.co2Grams)} g CO₂`;
  const tokens = nf0.format(d.tokens);

  return [
    `Dein KI-CO₂-Bericht`,
    ``,
    `Zusammenfassung`,
    `• Ergebnis: ${co2}`,
    `• Eingabe: ${tokens} Tokens • ${d.modelName} (${d.provider})`,
    `• Session: ${new Date(d.sessionDateISO).toLocaleDateString('de-DE')} • ${d.links.session ?? ''}`,
    ``,
    `Vergleiche aus dem Alltag`,
    `• Desktop-PC: ${d.comparisons.pc}`,
    `• Autofahrt (Benzin): ${d.comparisons.car}`,
    `• Haushaltsstrom: ${d.comparisons.household}`,
    `• Smartphone: ${d.comparisons.phone}`,
    `• LED-Lampe (10 W): ${d.comparisons.led}`,
    ``,
    `Details zur Eingabe`,
    `• Prompt-Auszug: "${d.promptExcerpt}"`,
    `• Zählung: input + output Tokens`,
    ``,
    `Optimierungsvorschläge (schnelle Wirkung)`,
    d.altModelSuggestion ? `1) Leichteres AI model für einfache Aufgaben (z. B. ${d.altModelSuggestion.name} → ${d.altModelSuggestion.gPer1k} g/1k).` : null,
    `2) Prompt trimmen: unnötigen Kontext entfernen.`,
    `3) Batching: verwandte Fragen in einem Prompt statt vieler Einzel-Calls.`,
    `4) Caching: gleiche Anfragen wiederverwenden.`,
    `5) Output begrenzen (max_tokens) und früh stoppen.`,
    ``,
    `Model-Effizienz (Richtwerte, g CO₂/1k Tokens)`,
    ...d.modelEfficiencyRows.map(r => `• ${r.name}: ${r.gPer1k} — ${r.bestFor}`),
    ``,
    `Methodik & Annahmen`,
    `• Emissionen je 1.000 Tokens (input + output) werden modellabhängig geschätzt.`,
    `• Strommix: 400 g CO₂/kWh (Richtwert).`,
    `• Vergleiche: Desktop-PC Stunden = CO₂[g]/60 · Auto km = CO₂[g]/150 · Haushalt Stunden = CO₂[g]/160 · Smartphone Ladungen = CO₂[g]/2,4 · LED Stunden = CO₂[g]/4 (Tage = Stunden/24).`,
    `• Tatsächliche Werte variieren je nach Region, Infrastruktur, Anbieter und Auslastung.`,
    `• Stand: ${d.methodologyVersionDate}.`,
    ``,
    `Abmelden: ${d.links.unsubscribe}`,
    `Datenschutzhinweise: ${d.links.privacy}`
  ].filter(Boolean).join('\n');
}

export function renderReportHtml(d: EmailReportInput) {
  const co2 = `${nf1.format(d.co2Grams)} g CO₂`;
  const tokens = nf0.format(d.tokens);
  const sessionDate = new Date(d.sessionDateISO).toLocaleDateString('de-DE');

  const effRows = d.modelEfficiencyRows.map(r => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f2f4f7;color:#1C0202;font:400 14px Raleway,Helvetica,Arial">${r.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f2f4f7;color:#1C0202;font:400 14px Raleway,Helvetica,Arial">${r.gPer1k}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f2f4f7;color:#475467;font:400 14px Raleway,Helvetica,Arial">${r.bestFor}</td>
    </tr>
  `).join('');

  return `<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>KI-CO₂-Bericht</title>
</head>
<body style="margin:0;padding:0;background:#f6f7f9;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;"><tr><td align="center" style="padding:24px;">
<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="width:620px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #eceff3;">
<tr><td style="padding:20px 24px;border-bottom:1px solid #f0f2f6;">
  <table width="100%"><tr>
    <td style="font:600 18px/1.2 Raleway,Helvetica,Arial;color:#1C0202">KI-CO₂-Bericht</td>
    <td align="right" style="font:400 12px/1.4 Raleway,Helvetica,Arial;color:#667085">${sessionDate}</td>
  </tr></table>
</td></tr>

<tr><td style="padding:24px;">
  <div style="font:700 28px/1.2 Raleway,Helvetica,Arial;color:#1C0202;margin-bottom:6px">${co2}</div>
  <div style="font:400 14px/1.6 Raleway,Helvetica,Arial;color:#475467">${tokens} Tokens · ${d.modelName} · ${d.provider}</div>
  ${d.links.session ? `<div style="margin-top:10px"><a href="${d.links.session}" style="font:600 13px/1 Raleway,Helvetica,Arial;color:#D52100;text-decoration:none">Session online ansehen →</a></div>` : ``}
</td></tr>

<tr><td style="padding:0 24px 4px;">
  <div style="font:700 16px/1.4 Raleway,Helvetica,Arial;color:#1C0202;margin-bottom:8px">Vergleiche aus dem Alltag</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 8px;">
    ${[
      [`${d.comparisons.pc}`, 'Desktop-PC'],
      [`${d.comparisons.car}`, 'Autofahrt (Benzin)'],
      [`${d.comparisons.household}`, 'Haushaltsstrom'],
      [`${d.comparisons.phone}`, 'Smartphone · volle Aufladungen'],
      [`${d.comparisons.led}`, 'LED-Lampe (10 W)'],
    ].map(([v,l]) => `
      <tr>
        <td style="background:#fafafa;border:1px solid #f0f2f6;border-radius:12px;padding:12px 14px;font:600 14px Raleway,Helvetica,Arial;color:#1C0202">${v}</td>
        <td style="background:#fafafa;border:1px solid #f0f2f6;border-radius:12px;padding:12px 14px;font:400 13px Raleway,Helvetica,Arial;color:#475467">${l}</td>
      </tr>`).join('')}
  </table>
</td></tr>

<tr><td style="padding:16px 24px 0;">
  <div style="font:700 16px/1.4 Raleway,Helvetica,Arial;color:#1C0202;margin-bottom:8px">Details zur Eingabe</div>
  <div style="font:400 14px/1.7 Raleway,Helvetica,Arial;color:#475467">
    <b>Prompt (Auszug):</b> "${d.promptExcerpt}" · <b>Zählung:</b> input + output Tokens
  </div>
</td></tr>

<tr><td style="padding:16px 24px 0;">
  <div style="font:700 16px/1.4 Raleway,Helvetica,Arial;color:#1C0202;margin-bottom:8px">Optimierungsvorschläge</div>
  <ol style="margin:0;padding-left:18px;font:400 14px/1.7 Raleway,Helvetica,Arial;color:#475467">
    ${d.altModelSuggestion ? `<li>Leichteres AI model für einfache Aufgaben (z. B. ${d.altModelSuggestion.name} → ${d.altModelSuggestion.gPer1k} g/1k).</li>` : ``}
    <li>Prompt trimmen: unnötigen Kontext und Beispiele entfernen.</li>
    <li>Batching: verwandte Fragen in einem Prompt statt vieler Einzel-Calls.</li>
    <li>Caching: gleiche Anfragen wiederverwenden (lokal/Server-Cache).</li>
    <li>Output begrenzen: <code>max_tokens</code> setzen und früh stoppen.</li>
  </ol>
</td></tr>

<tr><td style="padding:16px 24px 0;">
  <div style="font:700 16px/1.4 Raleway,Helvetica,Arial;color:#1C0202;margin-bottom:8px">Model-Effizienz (Richtwerte)</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    <tr>
      <th align="left" style="font:600 13px Raleway,Helvetica,Arial;color:#667085;padding:8px 0;border-bottom:1px solid #eceff3">AI model</th>
      <th align="left" style="font:600 13px Raleway,Helvetica,Arial;color:#667085;padding:8px 0;border-bottom:1px solid #eceff3">~ g CO₂ / 1k Tokens</th>
      <th align="left" style="font:600 13px Raleway,Helvetica,Arial;color:#667085;padding:8px 0;border-bottom:1px solid #eceff3">Empfohlen für</th>
    </tr>
    ${effRows}
  </table>
</td></tr>

<tr><td style="padding:16px 24px 0;">
  <div style="font:700 16px/1.4 Raleway,Helvetica,Arial;color:#1C0202;margin-bottom:8px">Methodik & Annahmen</div>
  <div style="font:400 13px/1.7 Raleway,Helvetica,Arial;color:#475467">
    • Emissionen je 1.000 Tokens (input + output) werden modellabhängig geschätzt.<br>
    • Strommix: 400 g CO₂/kWh (Richtwert).<br>
    • Vergleiche: Desktop-PC Stunden = CO₂[g]/60 · Auto km = CO₂[g]/150 · Haushalt Stunden = CO₂[g]/160 · Smartphone Ladungen = CO₂[g]/2,4 · LED Stunden = CO₂[g]/4 (Tage = Stunden/24).<br>
    • Tatsächliche Werte variieren nach Region, Infrastruktur, Anbieter und Auslastung.
  </div>
  <div style="font:400 12px/1.6 Raleway,Helvetica,Arial;color:#98a2b3;margin-top:6px">Stand: ${d.methodologyVersionDate}</div>
</td></tr>

<tr><td align="center" style="padding:20px 24px 24px">
  ${d.links.compare ? `<a href="${d.links.compare}" style="display:inline-block;background:#D52100;color:#fff;text-decoration:none;font:700 14px Raleway,Helvetica,Arial;padding:12px 18px;border-radius:10px">Weitere Modelle testen</a>` : ``}
</td></tr>

<tr><td style="padding:16px 24px 24px;border-top:1px solid #f0f2f6">
  <div style="font:400 12px/1.6 Raleway,Helvetica,Arial;color:#98a2b3">
    Du erhältst diese E-Mail, weil du einen CO₂-Bericht angefordert hast.
    <a href="${d.links.unsubscribe}" style="color:#D52100;text-decoration:none">Abmelden</a> ·
    <a href="${d.links.privacy}" style="color:#D52100;text-decoration:none">Datenschutzhinweise</a>
  </div>
</td></tr>

</table></td></tr></table>
</body></html>`;
}
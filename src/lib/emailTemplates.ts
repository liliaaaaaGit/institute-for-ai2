import { formatNumber } from '../i18n';

export interface EmailReportData {
  co2Grams: number;
  tokens: number;
  modelName: string;
  provider: string;
  originalPrompt?: string;
  comparisons: {
    pc: string;
    car: string;
    household: string;
    phone: string;
    led: string;
  };
  sessionId: string;
  timestamp: string;
}

export function generateEmailSubject(data: EmailReportData): string {
  return `Dein KI-CO₂-Bericht — ${formatNumber(data.co2Grams, 1)} g CO₂ für ${formatNumber(data.tokens, 0)} Tokens (${data.modelName})`;
}

export function generateEmailHTML(data: EmailReportData): string {
  const co2 = `${formatNumber(data.co2Grams, 1)} g CO₂`;
  const tokens = formatNumber(data.tokens, 0);
  const sessionDate = new Date(data.timestamp).toLocaleDateString('de-DE');
  const promptExcerpt = data.originalPrompt 
    ? data.originalPrompt.substring(0, 200) + (data.originalPrompt.length > 200 ? '...' : '')
    : 'Direkte Token-Eingabe';

  const modelEfficiencyRows = [
    { name: 'Mistral 7B', gPer1k: '0,5', bestFor: 'Einfache Texte, Zusammenfassungen' },
    { name: 'Claude Haiku', gPer1k: '1,0', bestFor: 'Schnelle Antworten, Chat' },
    { name: 'GPT-3.5', gPer1k: '1,0', bestFor: 'Allgemeine Aufgaben, Prototyping' },
    { name: 'Gemini 1.5 Pro', gPer1k: '2,5', bestFor: 'Lange Kontexte, Recherche' },
    { name: 'GPT-4o', gPer1k: '3,0', bestFor: 'Komplexe Analysen, Multimodal' },
    { name: 'Claude Sonnet', gPer1k: '3,0', bestFor: 'Kreatives Schreiben, Code' },
    { name: 'Mistral Large', gPer1k: '4,0', bestFor: 'Komplexe Aufgaben, Reasoning' },
    { name: 'GPT-4', gPer1k: '5,0', bestFor: 'Höchste Qualität, kritische Aufgaben' }
  ];

  const effRows = modelEfficiencyRows.map(r => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f2f4f7;color:#1C0202;font:400 14px Raleway,Helvetica,Arial">${r.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f2f4f7;color:#1C0202;font:400 14px Raleway,Helvetica,Arial">${r.gPer1k}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f2f4f7;color:#475467;font:400 14px Raleway,Helvetica,Arial">${r.bestFor}</td>
    </tr>
  `).join('');

  // Find lighter model suggestion
  const currentModelData = modelEfficiencyRows.find(m => 
    m.name.toLowerCase().includes(data.modelName.toLowerCase())
  );
  const altModelSuggestion = currentModelData 
    ? modelEfficiencyRows.find(m => 
        parseFloat(m.gPer1k.replace(',', '.')) < parseFloat(currentModelData.gPer1k.replace(',', '.'))
      )
    : modelEfficiencyRows[0];

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
  <div style="font:400 14px/1.6 Raleway,Helvetica,Arial;color:#475467">${tokens} Tokens · ${data.modelName} · ${data.provider}</div>
</td></tr>

<tr><td style="padding:0 24px 4px;">
  <div style="font:700 16px/1.4 Raleway,Helvetica,Arial;color:#1C0202;margin-bottom:8px">Vergleiche aus dem Alltag</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 8px;">
    ${[
      [data.comparisons.pc, 'Desktop-PC'],
      [data.comparisons.car, 'Autofahrt (Benzin)'],
      [data.comparisons.household, 'Haushaltsstrom'],
      [data.comparisons.phone, 'Smartphone · volle Aufladungen'],
      [data.comparisons.led, 'LED-Lampe (10 W)'],
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
    <b>Prompt (Auszug):</b> "${promptExcerpt}" · <b>Zählung:</b> input + output Tokens
  </div>
</td></tr>

<tr><td style="padding:16px 24px 0;">
  <div style="font:700 16px/1.4 Raleway,Helvetica,Arial;color:#1C0202;margin-bottom:8px">Optimierungsvorschläge</div>
  <ol style="margin:0;padding-left:18px;font:400 14px/1.7 Raleway,Helvetica,Arial;color:#475467">
    ${altModelSuggestion ? `<li>Leichteres AI-Modell für einfache Aufgaben (z. B. ${altModelSuggestion.name} → ${altModelSuggestion.gPer1k} g/1k).</li>` : ''}
    <li>Prompt trimmen: unnötigen Kontext und Beispiele entfernen.</li>
    <li>Batching: verwandte Fragen in einem Prompt statt vieler Einzel-Calls.</li>
    <li>Caching: gleiche Anfragen wiederverwenden (lokal/Server-Cache).</li>
    <li>Output begrenzen: <code>max_tokens</code> setzen und früh stoppen.</li>
  </ol>
</td></tr>

<tr><td style="padding:16px 24px 0;">
  <div style="font:700 16px/1.4 Raleway,Helvetica,Arial;color:#1C0202;margin-bottom:8px">Modell-Effizienz (Richtwerte)</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    <tr>
      <th align="left" style="font:600 13px Raleway,Helvetica,Arial;color:#667085;padding:8px 0;border-bottom:1px solid #eceff3">AI-Modell</th>
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
  <div style="font:400 12px/1.6 Raleway,Helvetica,Arial;color:#98a2b3;margin-top:6px">Stand: September 2025</div>
</td></tr>

<tr><td align="center" style="padding:20px 24px 24px">
  <a href="${import.meta.env.VITE_APP_URL || 'https://co-footprint-calcula-xwj8.bolt.host'}" style="display:inline-block;background:#D52100;color:#fff;text-decoration:none;font:700 14px Raleway,Helvetica,Arial;padding:12px 18px;border-radius:10px">Weitere Modelle testen</a>
</td></tr>

<tr><td style="padding:16px 24px 24px;border-top:1px solid #f0f2f6">
  <div style="font:400 12px/1.6 Raleway,Helvetica,Arial;color:#98a2b3">
    Du erhältst diese E-Mail, weil du einen CO₂-Bericht angefordert hast.
    <a href="${import.meta.env.VITE_APP_URL || 'https://co-footprint-calcula-xwj8.bolt.host'}/unsubscribe" style="color:#D52100;text-decoration:none">Abmelden</a> ·
    <a href="${import.meta.env.VITE_APP_URL || 'https://co-footprint-calcula-xwj8.bolt.host'}/privacy" style="color:#D52100;text-decoration:none">Datenschutzhinweise</a>
  </div>
</td></tr>

</table></td></tr></table>
</body></html>`;
}

export function generateEmailText(data: EmailReportData): string {
  const co2 = `${formatNumber(data.co2Grams, 1)} g CO₂`;
  const tokens = formatNumber(data.tokens, 0);
  const sessionDate = new Date(data.timestamp).toLocaleDateString('de-DE');
  const promptExcerpt = data.originalPrompt 
    ? data.originalPrompt.substring(0, 200) + (data.originalPrompt.length > 200 ? '...' : '')
    : 'Direkte Token-Eingabe';

  const modelEfficiencyRows = [
    { name: 'Mistral 7B', gPer1k: '0,5', bestFor: 'Einfache Texte, Zusammenfassungen' },
    { name: 'Claude Haiku', gPer1k: '1,0', bestFor: 'Schnelle Antworten, Chat' },
    { name: 'GPT-3.5', gPer1k: '1,0', bestFor: 'Allgemeine Aufgaben, Prototyping' },
    { name: 'Gemini 1.5 Pro', gPer1k: '2,5', bestFor: 'Lange Kontexte, Recherche' },
    { name: 'GPT-4o', gPer1k: '3,0', bestFor: 'Komplexe Analysen, Multimodal' },
    { name: 'Claude Sonnet', gPer1k: '3,0', bestFor: 'Kreatives Schreiben, Code' },
    { name: 'Mistral Large', gPer1k: '4,0', bestFor: 'Komplexe Aufgaben, Reasoning' },
    { name: 'GPT-4', gPer1k: '5,0', bestFor: 'Höchste Qualität, kritische Aufgaben' }
  ];

  // Find lighter model suggestion
  const currentModelData = modelEfficiencyRows.find(m => 
    m.name.toLowerCase().includes(data.modelName.toLowerCase())
  );
  const altModelSuggestion = currentModelData 
    ? modelEfficiencyRows.find(m => 
        parseFloat(m.gPer1k.replace(',', '.')) < parseFloat(currentModelData.gPer1k.replace(',', '.'))
      )
    : modelEfficiencyRows[0];

  return [
    `Dein KI-CO₂-Bericht`,
    ``,
    `Zusammenfassung`,
    `• Ergebnis: ${co2}`,
    `• Eingabe: ${tokens} Tokens • ${data.modelName} (${data.provider})`,
    `• Session: ${sessionDate}`,
    ``,
    `Vergleiche aus dem Alltag`,
    `• Desktop-PC: ${data.comparisons.pc}`,
    `• Autofahrt (Benzin): ${data.comparisons.car}`,
    `• Haushaltsstrom: ${data.comparisons.household}`,
    `• Smartphone: ${data.comparisons.phone}`,
    `• LED-Lampe (10 W): ${data.comparisons.led}`,
    ``,
    `Details zur Eingabe`,
    `• Prompt-Auszug: "${promptExcerpt}"`,
    `• Zählung: input + output Tokens`,
    ``,
    `Optimierungsvorschläge (schnelle Wirkung)`,
    altModelSuggestion ? `1) Leichteres AI-Modell für einfache Aufgaben (z. B. ${altModelSuggestion.name} → ${altModelSuggestion.gPer1k} g/1k).` : null,
    `2) Prompt trimmen: unnötigen Kontext entfernen.`,
    `3) Batching: verwandte Fragen in einem Prompt statt vieler Einzel-Calls.`,
    `4) Caching: gleiche Anfragen wiederverwenden.`,
    `5) Output begrenzen (max_tokens) und früh stoppen.`,
    ``,
    `Modell-Effizienz (Richtwerte, g CO₂/1k Tokens)`,
    ...modelEfficiencyRows.map(r => `• ${r.name}: ${r.gPer1k} — ${r.bestFor}`),
    ``,
    `Methodik & Annahmen`,
    `• Emissionen je 1.000 Tokens (input + output) werden modellabhängig geschätzt.`,
    `• Strommix: 400 g CO₂/kWh (Richtwert).`,
    `• Vergleiche: Desktop-PC Stunden = CO₂[g]/60 · Auto km = CO₂[g]/150 · Haushalt Stunden = CO₂[g]/160 · Smartphone Ladungen = CO₂[g]/2,4 · LED Stunden = CO₂[g]/4 (Tage = Stunden/24).`,
    `• Tatsächliche Werte variieren je nach Region, Infrastruktur, Anbieter und Auslastung.`,
    `• Stand: September 2025.`,
    ``,
    `Abmelden: ${import.meta.env.VITE_APP_URL || 'https://co-footprint-calcula-xwj8.bolt.host'}/unsubscribe`,
    `Datenschutzhinweise: ${import.meta.env.VITE_APP_URL || 'https://co-footprint-calcula-xwj8.bolt.host'}/privacy`
  ].filter(Boolean).join('\n');
}
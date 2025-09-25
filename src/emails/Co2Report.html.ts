/* --------------------------------------------------------------------------
   Institute for AI Austria — CO₂ Report Email (HTML)
   Colors:  Ink  #1C0202   Red #D52100   White #FFFFFF
   Typeface: Raleway (falls nicht verfügbar → System Sans)
   -------------------------------------------------------------------------- */

export type Co2ReportArgs = {
  resultGrams: number
  model: string
  tokens?: number
  prompt?: string
  comparisons?: Array<{ label: string; value: string }>
  /** Absoluter HTTPS-Pfad zum Logo (oder 'cid:ai-logo' wenn über Resend inline) */
  logoUrl?: string
}

const C = {
  ink: '#1C0202',
  red: '#D52100',
  white: '#FFFFFF',
  // dezenter, warmer Hintergrund und Card-Töne
  bg: '#FFF7F6',
  card: '#FFFFFF',
  cardBorder: '#F3D7D2',
  softRed: '#FBE4E0',
  pillBg: '#FCEAE7',
  pillText: '#6E1206',
  divider: '#F4E9E7',
}

const formatDE = (n: number, min = 0, max = 1) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: min, maximumFractionDigits: max })

export function co2EmailHtml({
  resultGrams,
  model,
  tokens,
  prompt,
  comparisons = [],
  logoUrl,
}: Co2ReportArgs) {
  const g = Math.max(0, Number(resultGrams || 0))
  const niceModel = model || 'AI Model'

  // Vergleichswerte (einfach & nachvollziehbar)
  // (kannst du später fachlich anpassen; Darstellung bleibt)
  const toMinutes = (grams: number, factor: number) => formatDE((grams / factor) * 60, 0, 1)
  const toMeters = (grams: number, factor: number) => formatDE((grams / factor) * 1000, 0, 1)
  const toCharges = (grams: number, factor: number) => formatDE(grams / factor, 0, 1)
  const toDays = (grams: number, factor: number) => formatDE(grams / factor, 1, 1)

  // simple Faktoren (nur Illustration):
  // PC 360g/kWh → 0.2 kW; Auto 150 g/km; Haushalt 400 g/kWh; Smartphone 2.4 g/Charge; LED 10W ~ 36 g/Tag
  const desktopMin = toMinutes(g, 360 * 0.2)    // Minuten PC-Nutzung
  const carMeters = toMeters(g, 150)            // Meter Autofahrt (Benzin)
  const homeMin = toMinutes(g, 400)             // Minuten Haushaltsstrom
  const phoneCharges = toCharges(g, 2.4)        // Anzahl Smartphone-Ladungen
  const ledDays = toDays(g, 36)                 // Tage LED 10W

  // Model-Badges
  const modelPill = (txt: string, level: 'High'|'Medium'|'Low' = 'High') => `
    <span style="
      display:inline-block;padding:6px 10px;border-radius:999px;
      background:${C.pillBg};color:${C.pillText};
      font-weight:600;font-size:12px;line-height:1;
      border:1px solid ${C.cardBorder}
    ">${txt}
      <span style="
        margin-left:8px;padding:4px 8px;border-radius:999px;
        background:${level==='High' ? '#EDE1DF' : level==='Medium' ? '#EFE7E5' : '#F1ECEB'};
        color:${C.ink};font-weight:700;font-size:11px;vertical-align:middle;
        border:1px solid ${C.cardBorder}
      ">${level}</span>
    </span>
  `

  // Model Efficiency Guide
  const modelsGuide = `
    ${guideItem('GPT-3.5 ⚡', '≈3 mg CO₂/Token – schnell, günstig', 'High')}
    ${guideItem('Claude Haiku 🌸', '≈3 mg/Token – effizient für Routine', 'High')}
    ${guideItem('Llama 2/3 7–13B 🦙', '≈3 mg/Token – flexibel/self-host', 'High')}
    ${guideItem('Claude Sonnet / Gemini Pro', '≈7,5 mg/Token – ausgewogen', 'Medium')}
    ${guideItem('GPT-4 / Claude Opus', '≈15 mg/Token – nur wenn nötig', 'Low')}
  `

  function guideItem(title: string, subtitle: string, level: 'High'|'Medium'|'Low') {
    return `
      <div style="
        border:1px solid ${C.cardBorder};border-radius:14px;padding:16px 18px;margin:0 0 12px 0;
        background:${C.white}">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="font-weight:700;color:${C.ink};font-size:16px;">${title}</div>
          ${modelPill(level, level as any)}
        </div>
        <div style="color:${C.ink};opacity:.8;margin-top:6px;font-size:14px;">${subtitle}</div>
      </div>
    `
  }

  // Reduktions-Plan (Texte so gelassen, wie du es mochtest)
  const reductionPlan = `
    <div style="border:1px solid ${C.cardBorder};border-radius:16px;background:${C.red}0D;padding:18px;margin:0 0 14px 0;">
      <div style="font-weight:800;color:${C.ink};font-size:18px;margin-bottom:8px;">Quick Wins (sofort)</div>
      <ul style="padding-left:20px;margin:0;color:${C.ink};">
        <li style="margin:8px 0;">Kurze, präzise Prompts nutzen – unnötigen Kontext weglassen.</li>
        <li style="margin:8px 0;">Für einfache Aufgaben leichtere Modelle verwenden (z. B. GPT-3.5, Claude Haiku, Llama-7B).</li>
        <li style="margin:8px 0;">Ähnliche Fragen bündeln (Batching) statt viele einzelne Anfragen zu stellen.</li>
      </ul>
    </div>

    <div style="border:1px solid ${C.cardBorder};border-radius:16px;background:${C.white};padding:18px;margin:0 0 14px 0;">
      <div style="font-weight:800;color:${C.ink};font-size:18px;margin-bottom:8px;">Mittelfristig (Prozess & Setup)</div>
      <ul style="padding-left:20px;margin:0;color:${C.ink};">
        <li style="margin:8px 0;">Zwischenergebnisse cachen – wiederkehrende Berechnungen vermeiden.</li>
        <li style="margin:8px 0;">Nützliche Antworten speichern und wiederverwenden (z. B. eine kleine Snippet-Bibliothek).</li>
        <li style="margin:8px 0;">Bei Bild/Video: Auflösung und Schritte bewusst niedrig halten – nur bei Bedarf erhöhen.</li>
        <li style="margin:8px 0;">Wenn möglich, Ausführung in Zeiten mit geringerer Netz-Emission planen.</li>
      </ul>
    </div>

    <div style="border:1px solid ${C.cardBorder};border-radius:16px;background:${C.white};padding:18px;">
      <div style="font-weight:800;color:${C.ink};font-size:18px;margin-bottom:8px;">Fortgeschritten (Power-User)</div>
      <ul style="padding-left:20px;margin:0;color:${C.ink};">
        <li style="margin:8px 0;">„Right-Sizing“: Modelle pro Use-Case benchmarken – kleinere 7–13B-Modelle sind oft 5–10× effizienter.</li>
        <li style="margin:8px 0;">Streaming verwenden – früh abbrechen spart Tokens.</li>
      </ul>
    </div>
  `

  // Vergleiche Tabelle
  const comparisonRows = `
    ${row('Desktop-PC', `${desktopMin} Minuten`)}
    ${row('Autofahrt (Benzin)', `${carMeters} Meter`)}
    ${row('Haushaltsstrom', `${homeMin} Minuten`)}
    ${row('Smartphone', `${phoneCharges} Aufladungen`)}
    ${row('LED-Lampe (10 W)', `${ledDays} Tage`)}
  `
  function row(left: string, right: string) {
    return `
      <div style="
        display:flex;align-items:center;justify-content:space-between;
        padding:10px 0;border-bottom:1px solid ${C.divider};">
        <div style="color:${C.ink};font-size:16px;">${left}</div>
        <div style="color:${C.ink};font-weight:800;font-size:16px;">${right}</div>
      </div>
    `
  }

  // Optionale Liste weiterer Vergleiche vom Client
  const extra = comparisons.length
    ? comparisons.map(c => row(c.label, c.value)).join('')
    : ''

  const headerLogo = logoUrl
    ? `<img src="${logoUrl}" alt="Institute for AI Austria" width="40" height="40"
          style="display:block;width:40px;height:40px;margin-right:12px;" />`
    : ''

  return `
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- Viele Clients ignorieren Webfonts; Fallbacks sind gesetzt -->
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <title>Ihr CO₂-Bericht – ${escapeHtml(niceModel)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${C.bg};">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="620" cellpadding="0" cellspacing="0" style="width:620px;max-width:100%;">
          <tr>
            <td style="font-family:'Raleway', Arial, 'Segoe UI', sans-serif;color:${C.ink};">
              <!-- Title Bar -->
              <div style="font-weight:800;font-size:28px;margin:0 0 18px 0;letter-spacing:0.2px;">
                Ihr CO₂-Bericht – ${escapeHtml(niceModel)}
              </div>

              <!-- Brand header -->
              <div style="display:flex;align-items:center;margin:0 0 12px 0;">
                ${headerLogo}
                <div style="line-height:1.25;">
                  <div style="font-weight:700;font-size:20px;color:${C.ink};">Institute for AI Austria</div>
                  <div style="font-weight:800;font-size:22px;color:${C.ink};margin-top:2px;">
                    Ihr CO₂-Bericht – ${escapeHtml(niceModel)}
                  </div>
                </div>
              </div>

              <!-- Summary -->
              <div style="
                border:1px solid ${C.cardBorder};background:${C.white};
                border-radius:16px;padding:18px;margin:16px 0;">
                <div style="font-weight:800;color:${C.ink};font-size:20px;margin-bottom:8px;">Zusammenfassung</div>
                <div style="color:${C.ink};font-size:16px;opacity:.9;">
                  Geschätzter CO₂-Ausstoß:
                  <span style="font-weight:800;color:${C.ink};">${formatDE(g, 0, 1)} g CO₂</span>
                  (Modell: <span style="font-weight:700;">${escapeHtml(niceModel)}</span>${tokens ? `, Tokens: <span style="font-weight:700;">${formatDE(tokens, 0, 0)}</span>` : ''}).
                </div>
              </div>

              <!-- Everyday comparisons -->
              <div style="
                border:1px solid ${C.cardBorder};background:${C.white};
                border-radius:16px;padding:18px;margin:0 0 16px 0;">
                <div style="font-weight:800;color:${C.ink};font-size:20px;margin-bottom:10px;">Alltagsvergleiche</div>
                ${comparisonRows}
                ${extra}
              </div>

              <!-- Reduction plan -->
              ${reductionPlan}

              <!-- Efficiency guide -->
              <div style="
                border:1px solid ${C.cardBorder};background:${C.white};
                border-radius:16px;padding:18px;margin:16px 0;">
                <div style="font-weight:800;color:${C.ink};font-size:20px;margin-bottom:10px;">Model Efficiency Guide</div>
                ${modelsGuide}
              </div>

              <!-- Footer -->
              <div style="color:${C.ink};opacity:.8;font-size:14px;line-height:1.55;margin-top:16px;">
                <strong>Datenschutzhinweis:</strong> Sie erhalten diese E-Mail, weil Sie dem Versand eines CO₂-Berichts zugestimmt haben.
                Details finden Sie in den Datenschutzhinweisen auf der Website.
              </div>
              <div style="text-align:center;color:${C.ink};opacity:.8;font-size:13px;margin:16px 0 6px 0;">
                © Institute for AI Austria
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/* ---------- helpers ------------------------------------------------------ */

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

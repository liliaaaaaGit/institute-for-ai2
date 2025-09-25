// src/emails/Co2Report.html.ts
// Brand: Raleway, #1C0202 (Ink), #D52100 (Red), #FFFFFF (White)

export type Comparison = { label: string; value: string }

export type Co2EmailOptions = {
  resultGrams: number
  model: string
  tokens?: number
  prompt?: string
  comparisons?: Comparison[]
  monthlyGoalGrams?: number
  thisMonthTotalGrams?: number
  viewLink?: string
  feedbackLink?: string
  logoUrlDark?: string
  logoUrlLight?: string
}

export function co2EmailHtml(opts: Co2EmailOptions) {
  const {
    resultGrams,
    model,
    tokens,
    prompt,
    comparisons = [],
    monthlyGoalGrams,
    thisMonthTotalGrams,
    viewLink = '#',
    feedbackLink = '#',
    logoUrlDark = 'https://assets.example/ai-logo-dark.png',
    logoUrlLight = 'https://assets.example/ai-logo-light.png',
  } = opts

  // Brand tokens
  const INK = '#1C0202'
  const RED = '#D52100'
  const WHITE = '#FFFFFF'
  const INK_SOFT = 'rgba(28,2,2,0.88)'
  const CARD_BG = '#1D1B1B'
  const CARD_BORDER = 'rgba(255,255,255,0.08)'
  const MUTED = 'rgba(255,255,255,0.78)'

  const fmt = (n: number) =>
    n.toLocaleString('de-DE', { maximumFractionDigits: 1 })

  const grams = resultGrams || 0
  const heavyModel = /gpt-4|opus|sonnet|o\d/i.test(model)
  const lotsOfTokens = (tokens ?? 0) > 20000

  // Tips
  const tipsQuick = [
    lotsOfTokens
      ? 'Prompts/Antworten um 20–40 % kürzen → spart direkt Tokens'
      : 'Kurze, präzise Prompts beibehalten – unnötigen Kontext weglassen',
    heavyModel
      ? 'Für einfache Aufgaben auf GPT-3.5 / Haiku / Llama-7B wechseln'
      : 'Leichte Modelle standardmäßig nutzen; schweres Modell nur gezielt',
    'Ähnliche Fragen bündeln (Batching) statt viele einzelne Anfragen',
  ]
  const tipsMid = [
    'Zwischenergebnisse cachen – gleiche Fragen nicht neu berechnen',
    'Nützliche Antworten speichern & wiederverwenden (Snippet-Library)',
    'Bild/Video: Auflösung/Steps bewusst niedrig halten – nur bei Bedarf erhöhen',
    'Wenn möglich zu Zeiten niedriger Netz-Emissionen laufen lassen',
  ]
  const tipsPro = [
    '“Right-Sizing”: Modelle pro Use-Case benchmarken (7–13B oft 5–10× effizienter)',
    'Streaming nutzen (früher Abbruch spart Tokens)',
    'System-/Few-Shot-Prompts stark verdichten; Beispiele minimal halten',
    'Monitoring: Tokens, g CO₂/Anfrage & Cache-Savings kontinuierlich tracken',
  ]

  const efficiencyGuide = [
    { name: 'GPT-3.5', tag: 'High', desc: '≈3 mg CO₂/Token – schnell, günstig', tone: 'good' },
    { name: 'Claude Haiku', tag: 'High', desc: '≈3 mg/Token – effizient für Routine', tone: 'good' },
    { name: 'Llama 2/3 7–13B', tag: 'High', desc: '≈3 mg/Token – flexibel/self-host', tone: 'good' },
    { name: 'Claude Sonnet / Gemini Pro', tag: 'Medium', desc: '≈7.5 mg/Token – ausgewogen', tone: 'mid' },
    { name: 'GPT-4 / Claude Opus', tag: 'Low', desc: '≈15 mg/Token – nur wenn nötig', tone: 'low' },
  ]

  let goalPct = 0
  if (monthlyGoalGrams && thisMonthTotalGrams && monthlyGoalGrams > 0) {
    goalPct = Math.min(100, Math.round((thisMonthTotalGrams / monthlyGoalGrams) * 100))
  }

  const comparisonRows = comparisons.map(c => `
    <tr>
      <td style="padding:8px 0;font:500 14px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};">${escapeHtml(c.label)}</td>
      <td align="right" style="padding:8px 0;font:600 14px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};">${escapeHtml(c.value)}</td>
    </tr>
  `).join('')

  const guideRows = efficiencyGuide.map(g => {
    const badgeBg =
      g.tone === 'good' ? 'rgba(213,33,0,0.18)'
      : g.tone === 'mid'  ? 'rgba(255,255,255,0.12)'
      : 'rgba(255,255,255,0.08)'
    return `
      <tr>
        <td style="padding:12px;border:1px solid ${CARD_BORDER};border-radius:12px;background:${CARD_BG};">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="font:600 15px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};">${g.name}</td>
              <td align="right">
                <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${badgeBg};font:700 12px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};">${g.tag}</span>
              </td>
            </tr>
            <tr><td colspan="2" style="height:6px;"></td></tr>
            <tr>
              <td colspan="2" style="font:500 13px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};">${g.desc}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
    `
  }).join('')

  const promptBlock = prompt ? `
    <tr><td style="height:8px;"></td></tr>
    <tr><td style="font:600 13px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};">Ihr Prompt</td></tr>
    <tr>
      <td style="background:#2A2626;border:1px solid ${CARD_BORDER};border-radius:10px;padding:10px;font:500 13px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};">
        ${escapeHtml(prompt)}
      </td>
    </tr>` : ''

  const goalBar = (monthlyGoalGrams && thisMonthTotalGrams) ? `
      <tr>
        <td style="padding:16px 0 0;">
          <div style="font:600 14px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};margin-bottom:8px;">
            Monatsziel&nbsp;(g&nbsp;CO₂)
          </div>
          <div style="background:#3A3535;border-radius:999px;width:100%;height:10px;">
            <div style="background:${RED};width:${goalPct}%;height:10px;border-radius:999px;"></div>
          </div>
          <div style="font:500 12px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};margin-top:6px;">
            Diesen Monat: ${fmt(thisMonthTotalGrams || 0)}g &nbsp;•&nbsp; ${goalPct}% des Ziels
          </div>
        </td>
      </tr>` : ''

  const raleway = `
    @font-face { font-family: 'Raleway'; font-style: normal; font-weight: 400; src: local('Raleway'); }
    @font-face { font-family: 'Raleway'; font-style: normal; font-weight: 600; src: local('Raleway'); }
    @font-face { font-family: 'Raleway'; font-style: normal; font-weight: 800; src: local('Raleway'); }
  `

  return `<!doctype html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    ${raleway}
    @media (max-width:600px){ .container{width:100%!important;} .pad{padding:16px!important;} .hero-num{font-size:36px!important;} }
    a.btn{ text-decoration:none; }
  </style>
</head>
<body style="margin:0;padding:0;background:${INK};">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${INK};">
    <tr>
      <td align="center" style="padding:28px 14px;">
        <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:600px;max-width:600px;background:${INK};border-radius:14px;">
          <!-- Header -->
          <tr>
            <td style="padding:0 8px 18px;">
              <table width="100%" role="presentation">
                <tr>
                  <td>
                    <img src="${logoUrlDark}" alt="Institute for AI" height="28" style="display:block;border:0;outline:none;">
                  </td>
                  <td align="right" style="font:700 12px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};letter-spacing:.04em;">
                    CO₂-Bericht
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Card -->
          <tr>
            <td class="pad" style="padding:22px;background:${CARD_BG};border:1px solid ${CARD_BORDER};border-radius:16px;">
              <table width="100%" role="presentation">
                <tr><td style="font:800 22px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};">Ihr CO₂-Bericht für diesen Prompt</td></tr>
                <tr><td style="height:6px;"></td></tr>
                <tr><td style="font:600 14px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};">Zusammenfassung</td></tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td>
                    <div class="hero-num" style="font:900 42px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};line-height:1;">
                      ${fmt(grams)} <span style="font:700 18px;color:${MUTED};">g CO₂</span>
                    </div>
                    <div style="font:600 14px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};margin-top:6px;">
                      Modell: <span style="color:${WHITE}">${escapeHtml(model)}</span>
                      ${tokens ? ` • Tokens: <span style="color:${WHITE}">${fmt(tokens)}</span>` : ''}
                    </div>
                  </td>
                </tr>
                ${promptBlock}
                <tr><td style="height:18px;"></td></tr>
                <tr><td style="font:700 15px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};">Alltagsvergleiche</td></tr>
                <tr><td style="height:8px;"></td></tr>
                <tr><td><table width="100%" role="presentation">${comparisonRows}</table></td></tr>
                <tr><td style="height:18px;"></td></tr>
                <tr>
                  <td>
                    <table role="presentation" width="100%">
                      <tr>
                        <td align="left">
                          <a class="btn" href="${viewLink}" style="display:inline-block;background:${RED};color:${WHITE};font:800 14px Raleway,Arial,Helvetica,sans-serif;padding:10px 16px;border-radius:10px;">Vollständigen Bericht ansehen</a>
                        </td>
                        <td align="right">
                          <a class="btn" href="${feedbackLink}" style="display:inline-block;background:transparent;border:1px solid ${CARD_BORDER};color:${WHITE};font:700 13px Raleway,Arial,Helvetica,sans-serif;padding:8px 14px;border-radius:10px;">Feedback geben</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${goalBar}
              </table>
            </td>
          </tr>

          <!-- Maßnahmenplan -->
          <tr><td style="height:16px;"></td></tr>
          ${renderTipsCard('Maßnahmen-Plan zur Reduktion', tipsQuick, tipsMid, tipsPro, CARD_BG, CARD_BORDER, RED, WHITE, MUTED)}

          <!-- Model Efficiency Guide -->
          <tr><td style="height:16px;"></td></tr>
          <tr>
            <td class="pad" style="padding:22px;background:${CARD_BG};border:1px solid ${CARD_BORDER};border-radius:16px;">
              <table width="100%" role="presentation">
                <tr><td style="font:800 18px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};">Model Efficiency Guide</td></tr>
                <tr><td style="height:12px;"></td></tr>
                ${guideRows}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr><td style="height:20px;"></td></tr>
          <tr>
            <td style="padding:10px 6px;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font:600 12px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};line-height:1.5;">
                    Datenschutzhinweis: Sie erhalten diese E-Mail, weil Sie dem Versand eines CO₂-Berichts zugestimmt haben.
                    Abbestellen: Antworten Sie mit <b>„Unsubscribe“</b>. Details siehe Datenschutzhinweise auf der Website.
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td align="center">
                    <img src="${logoUrlLight}" alt="Institute for AI" height="22" style="opacity:.9;display:block;border:0;">
                    <div style="font:600 11px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};margin-top:6px;">© Institute for AI Austria</div>
                  </td>
                </tr>
                <tr><td style="height:18px;"></td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderTipsCard(
  title: string,
  quick: string[],
  mid: string[],
  pro: string[],
  CARD_BG: string,
  CARD_BORDER: string,
  RED: string,
  WHITE: string,
  MUTED: string
){
  return `
  <tr>
    <td class="pad" style="padding:22px;background:${CARD_BG};border:1px solid ${CARD_BORDER};border-radius:16px;">
      <table width="100%" role="presentation">
        <tr><td style="font:800 18px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};">${title}</td></tr>
        <tr><td style="height:10px;"></td></tr>
        ${renderTipsBlock('Quick Wins (sofort)', quick, RED, WHITE, MUTED)}
        <tr><td style="height:10px;"></td></tr>
        ${renderTipsBlock('Mittelfristig (Prozess & Setup)', mid, 'rgba(213,33,0,0.25)', WHITE, MUTED)}
        <tr><td style="height:10px;"></td></tr>
        ${renderTipsBlock('Fortgeschritten (Power-User)', pro, 'rgba(255,255,255,0.12)', WHITE, MUTED)}
      </table>
    </td>
  </tr>`
}

function renderTipsBlock(
  title: string,
  items: string[],
  bg: string,
  WHITE = '#FFFFFF',
  MUTED = 'rgba(255,255,255,0.78)'
){
  const lis = items.map(t => `
    <tr>
      <td style="vertical-align:top;padding:6px 0;">
        <div style="width:8px;height:8px;background:${WHITE};border-radius:999px;margin-top:8px;"></div>
      </td>
      <td style="padding:4px 0 4px 10px;font:500 13.5px Raleway,Arial,Helvetica,sans-serif;color:${MUTED};">
        ${escapeHtml(t)}
      </td>
    </tr>`).join('')
  return `
    <tr>
      <td style="background:${bg};border-radius:12px;padding:14px;">
        <div style="font:800 14px Raleway,Arial,Helvetica,sans-serif;color:${WHITE};margin-bottom:6px;">${title}</div>
        <table role="presentation">${lis}</table>
      </td>
    </tr>`
}

// /src/emails/Co2Report.html.ts
import { brand, bullets, htmlEscape, modelCards, sectionTitle, subjectFor as _subjectFor } from "./reportTemplates";
import { t, formatNumber, getCurrentLanguage } from "../lib/i18n";

export type Co2Props = {
  model?: string;
  co2Grams?: number;          // z. B. 45.6
  tokens?: number;            // z. B. 3040
  // Vergleichswerte – bereits auf die finale Einheit umgerechnet
  pcMinutes?: number;         // Minuten
  carMeters?: number;         // Meter
  householdMinutes?: number;  // Minuten
  phoneCharges?: number;      // Aufladungen
  ledHours?: number;          // Stunden
};

const defaultProps: Required<Co2Props> = {
  model: "GPT-4",
  co2Grams: 45.6,
  tokens: 3040,
  pcMinutes: 8.2,
  carMeters: 180,
  householdMinutes: 12.5,
  phoneCharges: 1.2,
  ledHours: 76,
};

// kleine Tabellenzeile für „Alltagsvergleiche“
function compRow(label: string, value: string, isLast = false) {
  return `
    <tr>
      <td style="padding:16px 20px;font:400 16px/1.5 ${brand.font};color:${brand.dark};border-bottom:${isLast ? "none" : `1px solid ${brand.border}`};">${htmlEscape(
        label
      )}</td>
      <td style="padding:16px 20px;font:600 16px/1.5 ${brand.font};color:${brand.dark};text-align:right;border-bottom:${isLast ? "none" : `1px solid ${brand.border}`};">${htmlEscape(
        value
      )}</td>
    </tr>
  `;
}

export function co2EmailHtml(input?: Co2Props): string {
  const p = { ...defaultProps, ...(input || {}) };
  const lang = getCurrentLanguage();

  // Action-Listen (Texte bereits abgestimmt)
  const quickWins = bullets([
    lang === 'de' 
      ? "Kurze, präzise Prompts nutzen – unnötigen Kontext weglassen."
      : "Use short, precise prompts – eliminate unnecessary context.",
    lang === 'de'
      ? "Für einfache Aufgaben leichtere Modelle verwenden (z. B. GPT-3.5, Claude Haiku, Llama-7B)."
      : "Use lighter models for simple tasks (e.g., GPT-3.5, Claude Haiku, Llama-7B).",
    lang === 'de'
      ? "Ähnliche Fragen bündeln (Batching) statt viele einzelne Anfragen zu stellen."
      : "Bundle similar questions (batching) instead of making many individual requests."
  ]);

  const midTerm = bullets([
    lang === 'de'
      ? "Zwischenergebnisse cachen – wiederkehrende Berechnungen vermeiden."
      : "Cache intermediate results – avoid recurring calculations.",
    lang === 'de'
      ? "Nützliche Antworten speichern und wiederverwenden (z. B. eine kleine Snippet-Bibliothek)."
      : "Save and reuse useful answers (e.g., a small snippet library).",
    lang === 'de'
      ? "Bei Bild/Video: Auflösung und Schritte bewusst niedrig halten – nur bei Bedarf erhöhen."
      : "For images/video: Keep resolution and steps deliberately low – only increase when needed.",
    lang === 'de'
      ? "Wenn möglich, Ausführung in Zeiten mit geringerer Netz-Emission planen."
      : "When possible, schedule execution during times with lower grid emissions."
  ]);

  const advanced = bullets([
    lang === 'de'
      ? '"Right-Sizing": Modelle pro Use-Case benchmarken – kleinere 7–13B-Modelle sind oft 5–10× effizienter.'
      : '"Right-Sizing": Benchmark models per use case – smaller 7–13B models are often 5–10× more efficient.',
    lang === 'de'
      ? 'Streaming verwenden – früh abbrechen spart Tokens.'
      : 'Use streaming – early termination saves tokens.',
    lang === 'de'
      ? 'System-/Few-Shot-Prompts stark verdichten; Beispiele auf das Minimum reduzieren.'
      : 'Heavily compress system/few-shot prompts; reduce examples to minimum.',
    lang === 'de'
      ? 'Monitoring etablieren: Tokens, g CO₂/Anfrage sowie Cache-Ersparnisse kontinuierlich messen.'
      : 'Establish monitoring: Continuously measure tokens, g CO₂/request, and cache savings.'
  ]);

  return `<!doctype html>
<html lang="de">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <!-- Google Fonts: Raleway (optional – viele Clients laden das) -->
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">
    <title>${htmlEscape(_subjectFor(p.model))}</title>
  </head>
  <body style="margin:0;padding:0;background:${brand.bg}">
    <center style="width:100%;background:${brand.bg}">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:${brand.bg}">
        <tr>
          <td align="center" style="padding:0">
            <table role="presentation" width="100%" style="max-width:600px;border-collapse:collapse;background:${brand.bg}">
              
              <!-- Titelblock -->
              <tr>
                <td style="padding:32px 24px 8px 24px;background:${brand.bg}">
                  <h1 style="margin:0 0 8px 0;font:700 28px/1.2 ${brand.font};color:${brand.dark};letter-spacing:-0.3px">
                    ${htmlEscape(t('email.subject', { model: p.model }))}
                  </h1>
                  <p style="margin:0;font:400 16px/1.4 ${brand.font};color:#666">${t('email.copyright')}</p>
                </td>
              </tr>

              <!-- Zusammenfassung -->
              <tr>
                <td style="padding:16px 24px;background:${brand.bg}">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;background:#fff;border:1px solid ${brand.border};border-radius:${brand.radius}">
                    <tr>
                      <td style="padding:20px">
                        <h2 style="margin:0 0 12px 0;font:700 20px/1.3 ${brand.font};color:${brand.dark}">${t('email.summary')}</h2>
                        <p style="margin:0;font:400 16px/1.55 ${brand.font};color:${brand.dark}">
                          ${t('email.estimatedEmissions', { grams: formatNumber(p.co2Grams, 1) })}
                          (${t('email.modelTokens', { model: p.model, tokens: formatNumber(p.tokens, 0) })}).
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Alltagsvergleiche -->
              <tr>
                <td style="padding:8px 24px 24px;background:${brand.bg}">
                  ${sectionTitle(t('email.comparisons'))}
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;background:#fff;border:1px solid ${brand.border};border-radius:${brand.radius}">
                    <tbody>
                      ${compRow(t('email.comparison.pc'), `${formatNumber(p.pcMinutes)} ${t('email.comparison.pcUnit')}`)}
                      ${compRow(t('email.comparison.car'), `${formatNumber(p.carMeters)} ${t('email.comparison.carUnit')}`)}
                      ${compRow(t('email.comparison.household'), `${formatNumber(p.householdMinutes)} ${t('email.comparison.householdUnit')}`)}
                      ${compRow(t('email.comparison.phone'), `${formatNumber(p.phoneCharges)} ${t('email.comparison.phoneUnit')}`)}
                      ${compRow(t('email.comparison.led'), `${formatNumber(p.ledHours)} ${t('email.comparison.ledUnit')}`, true)}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- CO2-Optimierung -->
              <tr>
                <td style="padding:0 24px 8px;background:${brand.bg}">
                  ${sectionTitle(t('email.optimization'))}
                </td>
              </tr>

              <!-- Quick Wins -->
              <tr>
                <td style="padding:0 24px 16px;background:${brand.bg}">
                  ${actionCard(t('email.quickWins'), "#FFE3DE", quickWins)}
                </td>
              </tr>

              <!-- Mittelfristig -->
              <tr>
                <td style="padding:0 24px 16px;background:${brand.bg}">
                  ${actionCard(t('email.midTerm'), "#FFD6CF", midTerm)}
                </td>
              </tr>

              <!-- Fortgeschritten -->
              <tr>
                <td style="padding:0 24px 24px;background:${brand.bg}">
                  ${actionCard(t('email.advanced'), "#FFC9C1", advanced)}
                </td>
              </tr>

              <!-- Model Efficiency Guide -->
              <tr>
                <td style="padding:0 24px 16px;background:${brand.bg}">
                  ${sectionTitle(t('email.modelGuide'))}
                  ${modelCards()}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px;background:${brand.bg};border-top:1px solid ${brand.border}">
                  <p style="margin:0 0 12px 0;font:400 14px/1.5 ${brand.font};color:#666">
                    <strong>${lang === 'de' ? 'Datenschutzhinweis:' : 'Privacy Notice:'}</strong> ${t('email.privacyNote')}
                  </p>
                  <p style="margin:0;font:400 14px/1.5 ${brand.font};color:#666">${t('email.copyright')}</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>`;
}

// kleine Helferkarte mit farbigem Hintergrund
function actionCard(title: string, bg: string, listHtml: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;background:${bg};border-radius:${brand.radius}">
      <tr>
        <td style="padding:20px">
          <h3 style="margin:0 0 12px 0;font:700 18px/1.3 ${brand.font};color:${brand.dark}">${htmlEscape(
            title
          )}</h3>
          ${listHtml}
        </td>
      </tr>
    </table>
  `;
}

// Betreff für den Sender wiederverwenden
export const subjectFor = _subjectFor;

// Optionaler Default-Export (falls du irgendwo `default` importierst)
export default co2EmailHtml;

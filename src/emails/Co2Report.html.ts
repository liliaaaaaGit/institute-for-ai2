// /src/emails/Co2Report.html.ts
import {
  brand,
  sectionTitle,
  cardWrapOpen,
  cardWrapClose,
  listBullets,
  quickWins,
  midTerm,
  advanced,
  modelCardsHtml,
  subjectFor as subjectFromTemplates,
  htmlEscape,
} from "./reportTemplates";

export type Co2Props = {
  // Header & Summary
  model?: string;
  co2?: string;       // "45,6"
  tokens?: string;    // "3.040"

  // Alltagsvergleiche (nur EIN Wert pro Zeile – keine Duplikate)
  pcMinutes?: string;        // "8.2"
  carMeters?: string;        // "180"
  householdMinutes?: string; // "12.5"
  phoneCharges?: string;     // "1.2"
  ledHours?: string;         // "76"
};

// Re-Export für bequemen Import an anderer Stelle
export const subjectFor = subjectFromTemplates;

/**
 * Baut das vollständige HTML für den E-Mail-Report.
 * Server-seitig verwenden: an Resend mit { html } senden.
 */
export default function co2ReportHtml({
  model = "GPT-4",
  co2 = "45,6",
  tokens = "3.040",
  pcMinutes = "8,2",
  carMeters = "180",
  householdMinutes = "12,5",
  phoneCharges = "1,2",
  ledHours = "76",
}: Co2Props = {}): string {
  const h = {
    wrapOpen: `<div style="font-family:${brand.font};max-width:600px;margin:0 auto;background:${brand.bg}">`,
    wrapClose: `</div>`,
    header: `
      <div style="background:${brand.red};padding:16px 24px">
        <div style="color:#fff;font:600 18px/1 ${brand.font}">Institute for AI</div>
      </div>
    `,
    titleBlock: `
      <div style="padding:32px 24px 24px">
        <h1 style="margin:0 0 8px 0;color:${brand.text};font:800 28px/1.25 ${brand.font};letter-spacing:-0.5px">
          Ihr CO₂-Bericht – ${htmlEscape(model)}
        </h1>
        <p style="margin:0;color:${brand.textDim};font:400 16px/1.4 ${brand.font}">
          Institute for AI
        </p>
      </div>
    `,
    summary: `
      <div style="padding:0 24px 24px">
        ${cardWrapOpen()}
          <h2 style="margin:0 0 12px 0;color:${brand.text};font:700 20px/1.3 ${brand.font}">Zusammenfassung</h2>
          <p style="margin:0;color:${brand.text};font:400 16px/1.55 ${brand.font}">
            Geschätzter CO₂-Ausstoß: <strong>${htmlEscape(
              co2
            )} g CO₂</strong> (Modell: ${htmlEscape(model)}, Tokens: ${htmlEscape(
      tokens
    )}).
          </p>
        ${cardWrapClose}
      </div>
    `,
    comparisons: `
      <div style="padding:0 24px 32px">
        ${sectionTitle("Alltagsvergleiche")}
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" 
               style="width:100%;background:${brand.card};border:1px solid ${brand.border};border-radius:${brand.radius};border-collapse:separate;border-spacing:0">
          <tbody>
            ${row("Desktop-PC", `${htmlEscape(pcMinutes)} Minuten`, true, false)}
            ${row("Autofahrt (Benzin)", `${htmlEscape(carMeters)} Meter`)}
            ${row("Haushaltsstrom", `${htmlEscape(householdMinutes)} Minuten`)}
            ${row("Smartphone", `${htmlEscape(phoneCharges)} Aufladungen`)}
            ${row("LED-Lampe (10 W)", `${htmlEscape(ledHours)} Stunden`, false, true)}
          </tbody>
        </table>
      </div>
    `,
    optimizationHeader: `
      <div style="padding:0 24px 24px">
        ${sectionTitle("CO₂-Optimierung")}
      </div>
    `,
    actions: `
      <div style="padding:0 24px 32px">
        ${actionCard("Quick Wins (sofort)", "#FFE3DE", quickWins)}
        ${actionCard("Mittelfristig (Prozess & Setup)", "#FFD6CF", midTerm)}
        ${actionCard("Fortgeschritten (Power-User)", "#FFC9C1", advanced)}
      </div>
    `,
    models: `
      <div style="padding:0 24px 32px">
        ${sectionTitle("Model Efficiency Guide")}
        ${modelCardsHtml()}
      </div>
    `,
    footer: `
      <div style="padding:24px;border-top:1px solid ${brand.border}">
        <p style="margin:0 0 12px 0;color:${brand.textDim};font:400 14px/1.45 ${brand.font}">
          <strong>Datenschutzhinweis:</strong> Sie erhalten diese E-Mail, weil Sie dem Versand eines CO₂-Berichts zugestimmt haben.
          Details finden Sie in den Datenschutzhinweisen auf der Website (https://institute-for-ai.com/impressum-datenschutz).
        </p>
        <p style="margin:0;color:${brand.textDim};font:400 14px/1.45 ${brand.font}">© Institute for AI</p>
      </div>
    `,
  };

  return [
    h.wrapOpen,
    h.header,
    h.titleBlock,
    h.summary,
    h.comparisons,
    h.optimizationHeader,
    h.actions,
    h.models,
    h.footer,
    h.wrapClose,
  ].join("");
}

// ===== Local helpers for this file =====

function row(
  label: string,
  value: string,
  isFirst = false,
  isLast = false
): string {
  const b = isLast ? "none" : `1px solid ${brand.border}`;
  return `
  <tr>
    <td style="padding:16px 20px;font:400 16px/1.5 ${brand.font};color:${brand.text};border-bottom:${b}">${htmlEscape(
      label
    )}</td>
    <td style="padding:16px 20px;font:600 16px/1.5 ${brand.font};color:${brand.text};text-align:right;border-bottom:${b}">${htmlEscape(
      value
    )}</td>
  </tr>`;
}

function actionCard(title: string, bg: string, items: string[]) {
  return `
  <div style="background:${bg};border-radius:${brand.radius};padding:20px;margin:0 0 16px 0">
    <h3 style="margin:0 0 16px 0;color:${brand.text};font:700 18px/1.3 ${brand.font}">${htmlEscape(
      title
    )}</h3>
    ${listBullets(items)}
  </div>`;
}

// /src/emails/Co2Report.html.ts
import { brand, bullets, sectionTitle, modelCards, logoInlineSvg, htmlEscape, type Comparison } from "./reportTemplates";

type Props = {
  resultGrams: number;
  model: string;
  tokens?: number;
  comparisons?: Comparison[];
  /** Absolute https URL to your logo (preferred). If missing we use the inline SVG fallback. */
  logoUrl?: string;
};

const head = () => `
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap" rel="stylesheet" />
<title>CO₂-Bericht</title>
`;

const header = (model: string, logoUrl?: string) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
    <tr>
      <td style="padding:8px 0 18px 0">
        <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
          <tr>
            <td style="vertical-align:top;padding-right:10px">
              ${
                logoUrl
                  ? `<img src="${htmlEscape(logoUrl)}" width="34" height="34" alt="Institute for AI Austria" style="display:block" />`
                  : logoInlineSvg
              }
            </td>
            <td>
              <div style="font:700 18px/1.2 ${brand.font};color:${brand.ink}">Institute for AI Austria</div>
              <div style="font:700 24px/1.35 ${brand.font};color:${brand.ink};margin-top:4px">
                Ihr CO₂-Bericht – ${htmlEscape(model)}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

const summaryCard = (grams: number, model: string, tokens?: number) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;margin:0 0 16px 0">
    <tr>
      <td style="background:${brand.cardBg};border:1px solid ${brand.borderSoft};border-radius:${brand.radius};padding:14px">
        ${sectionTitle("Zusammenfassung")}
        <div style="font:400 15px/1.65 ${brand.font};color:${brand.ink}">
          Geschätzter CO₂-Ausstoß: <strong style="font-weight:700">${grams.toLocaleString("de-DE", {
            maximumFractionDigits: 1,
          })} g CO₂</strong>
          (Modell: <strong> ${htmlEscape(model)}</strong>${typeof tokens === "number" ? `, Tokens: <strong>${tokens.toLocaleString("de-DE")}</strong>` : ""}).
        </div>
      </td>
    </tr>
  </table>
`;

const comparisonsTable = (list: Comparison[] = []) => {
  // de-duplicate by label; keep the first value passed in
  const seen = new Set<string>();
  const rows = list.filter(({ label }) => {
    const key = (label || "").trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (!rows.length) return "";

  const rowHtml = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${brand.borderSoft};font:600 15px/1.5 ${brand.font};color:${brand.ink}">
          ${htmlEscape(r.label)}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid ${brand.borderSoft};font:700 15px/1.5 ${brand.font};color:${brand.ink};text-align:right">
          ${htmlEscape(r.value)}
        </td>
      </tr>`
    )
    .join("");

  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;margin:0 0 16px 0">
    <tr>
      <td style="background:${brand.cardBg};border:1px solid ${brand.borderSoft};border-radius:${brand.radius};padding:14px">
        ${sectionTitle("Alltagsvergleiche")}
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
          ${rowHtml}
        </table>
      </td>
    </tr>
  </table>`;
};

const sectionTint = (title: string, items: string[], tint: string) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;margin:0 0 16px 0">
    <tr>
      <td style="background:${tint};border:1px solid ${brand.borderSoft};border-radius:${brand.radius};padding:14px">
        ${sectionTitle(title)}
        ${bullets(items)}
      </td>
    </tr>
  </table>
`;

const privacy = () => `
  <div style="margin-top:8px;font:400 13px/1.6 ${brand.font};color:${brand.ink};opacity:.9">
    <strong style="font-weight:700">Datenschutzhinweis:</strong>
    Sie erhalten diese E-Mail, weil Sie dem Versand eines CO₂-Berichts zugestimmt haben.
    Details finden Sie in den Datenschutzhinweisen auf der Website.
  </div>
  <div style="margin-top:12px;font:600 13px/1.4 ${brand.font};color:${brand.ink};text-align:center">© Institute for AI Austria</div>
`;

export function co2EmailHtml({ resultGrams, model, tokens, comparisons, logoUrl }: Props) {
  return `
<!doctype html>
<html lang="de">
  <head>${head()}</head>
  <body style="margin:0;background:${brand.pageBg}">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
      <tr>
        <td style="padding:28px 16px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" align="center" style="max-width:720px;margin:0 auto;border-collapse:collapse">
            <tr><td style="font:700 28px/1.25 ${brand.font};color:${brand.ink};padding-bottom:12px">Ihr CO₂-Bericht – ${htmlEscape(model)}</td></tr>

            <tr><td>${header(model, logoUrl)}</td></tr>
            <tr><td>${summaryCard(resultGrams, model, tokens)}</td></tr>
            <tr><td>${comparisonsTable(comparisons)}</td></tr>

            <tr><td>${sectionTint("Quick Wins (sofort)", [
              "Kurze, präzise Prompts nutzen – unnötigen Kontext weglassen.",
              "Für einfache Aufgaben leichtere Modelle verwenden (z. B. GPT-3.5, Claude Haiku, Llama-7B).",
              "Ähnliche Fragen bündeln (Batching) statt viele einzelne Anfragen zu stellen."
            ], brand.tintStrong)}</td></tr>

            <tr><td>${sectionTint("Mittelfristig (Prozess & Setup)", [
              "Zwischenergebnisse cachen – wiederkehrende Berechnungen vermeiden.",
              "Nützliche Antworten speichern und wiederverwenden (z. B. eine kleine Snippet-Bibliothek).",
              "Bei Bild/Video: Auflösung und Schritte bewusst niedrig halten – nur bei Bedarf erhöhen.",
              "Wenn möglich, Ausführung in Zeiten mit geringerer Netz-Emission planen."
            ], brand.tintMid)}</td></tr>

            <tr><td>${sectionTint("Fortgeschritten (Power-User)", [
              "„Right-Sizing“: Modelle pro Use-Case benchmarken – kleinere 7–13B-Modelle sind oft 5–10× effizienter.",
              "Streaming verwenden – früh abbrechen spart Tokens.",
              "System-/Few-Shot-Prompts stark verdichten; Beispiele auf das Minimum reduzieren.",
              "Monitoring etablieren: Tokens, g CO₂/Anfrage sowie Cache-Ersparnisse kontinuierlich messen."
            ], brand.tintSoft)}</td></tr>

            <tr>
              <td>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;margin:0 0 16px 0">
                  <tr>
                    <td style="background:${brand.cardBg};border:1px solid ${brand.borderSoft};border-radius:${brand.radius};padding:14px">
                      ${sectionTitle("Model Efficiency Guide")}
                      ${modelCards()}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr><td>${privacy()}</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

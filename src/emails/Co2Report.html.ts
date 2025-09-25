// /src/emails/Co2Report.html.ts
import {
  brand,
  fmtDE,
  htmlEscape,
  bullets,
  sectionTitle,
  logoInlineSvg,
  quickWins,
  midTerm,
  advanced,
  modelCards,
  subjectFor,
  type Comparison,
} from "./reportTemplates";

type EmailInput = {
  resultGrams: number;
  model: string;
  tokens?: number;
  prompt?: string;
  comparisons?: Comparison[];
};

/**
 * Baut den vollständigen HTML-Body für den CO₂-Report.
 * – Keine Buttons/CTAs (entfernt).
 * – Kurzer DSGVO-Text ohne Unsubscribe.
 * – Inline-Logo (funktioniert ohne externe Assets).
 * – Brandfarben & Raleway-Fallback.
 */
export function co2EmailHtml({
  resultGrams,
  model,
  tokens,
  prompt,
  comparisons = [],
}: EmailInput): string {
  const grams = Math.max(0, Number(resultGrams || 0));
  const title = subjectFor(model);

  const comparisonRows =
    comparisons.length > 0
      ? comparisons
          .map(
            (c) => `
            <tr>
              <td style="padding:10px 0;color:${brand.text};font:500 15px/1.5 ${brand.font}">
                ${htmlEscape(c.label)}
              </td>
              <td style="padding:10px 0;color:${brand.text};font:700 15px/1.5 ${brand.font};text-align:right">
                ${htmlEscape(c.value)}
              </td>
            </tr>`
          )
          .join("")
      : "";

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${htmlEscape(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${brand.bg}">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:${brand.bg}">
      <tr>
        <td align="center" style="padding:24px">
          <!-- container -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:separate">
            <!-- Header -->
            <tr>
              <td style="padding:6px 0 18px 0">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align:middle;line-height:0">${logoInlineSvg}</td>
                    <td style="padding-left:12px;vertical-align:middle">
                      <div style="font:600 18px/1.2 ${brand.font};color:${brand.text}">Institute for AI Austria</div>
                      <div style="font:700 20px/1.3 ${brand.font};color:${brand.text};margin-top:6px">Ihr CO₂-Bericht – ${htmlEscape(
                        model
                      )}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Summary Card -->
            <tr>
              <td style="background:${brand.card};border:1px solid ${brand.border};border-radius:${brand.radius};padding:18px">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font:700 16px/1.3 ${brand.font};color:${brand.text}">Zusammenfassung</td>
                  </tr>
                  <tr>
                    <td style="padding-top:8px;font:400 14px/1.6 ${brand.font};color:${brand.textDim}">
                      Geschätzter CO₂-Ausstoß:
                      <span style="color:${brand.text};font:800 18px/1 ${brand.font}">${fmtDE(
                        grams,
                        1
                      )}&nbsp;g CO₂</span>
                      (Modell: <strong>${htmlEscape(model)}</strong>${
    tokens ? `, Tokens: <strong>${fmtDE(tokens, 0)}</strong>` : ""
  }).
                    </td>
                  </tr>
                  ${
                    prompt
                      ? `<tr>
                          <td style="padding-top:10px">
                            <div style="background:${brand.bg};border:1px dashed ${brand.border};border-radius:10px;padding:12px;color:${brand.textDim};font:400 13px/1.5 ${brand.font}">
                              <div style="font:600 12px/1 ${brand.font};color:${brand.textDim};text-transform:uppercase;letter-spacing:.3px;margin-bottom:6px">Ihr Prompt</div>
                              ${htmlEscape(prompt)}
                            </div>
                          </td>
                        </tr>`
                      : ""
                  }
                </table>
              </td>
            </tr>

            <!-- Spacer -->
            <tr><td style="height:14px"></td></tr>

            <!-- Comparisons -->
            ${
              comparisonRows
                ? `
            <tr>
              <td style="background:${brand.card};border:1px solid ${brand.border};border-radius:${brand.radius};padding:18px">
                ${sectionTitle("Alltagsvergleiche")}
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                  ${comparisonRows}
                </table>
              </td>
            </tr>
            <tr><td style="height:14px"></td></tr>`
                : ""
            }

            <!-- Reduction Plan -->
            <tr>
              <td>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate">
                  <tr>
                    <td style="background:${brand.red};border-radius:${brand.radius};padding:16px">
                      ${sectionTitle("Quick Wins (sofort)", true)}
                      ${bullets(quickWins)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr><td style="height:12px"></td></tr>

            <tr>
              <td style="background:${brand.card};border:1px solid ${brand.border};border-radius:${brand.radius};padding:16px">
                ${sectionTitle("Mittelfristig (Prozess & Setup)")}
                ${bullets(midTerm)}
              </td>
            </tr>

            <tr><td style="height:12px"></td></tr>

            <tr>
              <td style="background:${brand.card};border:1px solid ${brand.border};border-radius:${brand.radius};padding:16px">
                ${sectionTitle("Fortgeschritten (Power-User)")}
                ${bullets(advanced)}
              </td>
            </tr>

            <!-- Spacer -->
            <tr><td style="height:16px"></td></tr>

            <!-- Model Efficiency Guide -->
            <tr>
              <td style="background:${brand.card};border:1px solid ${brand.border};border-radius:${brand.radius};padding:18px">
                ${sectionTitle("Model Efficiency Guide")}
                ${modelCards()}
              </td>
            </tr>

            <!-- Footer -->
            <tr><td style="height:18px"></td></tr>
            <tr>
              <td style="color:${brand.textDim};font:400 12px/1.6 ${brand.font}">
                Datenschutzhinweis: Sie erhalten diese E-Mail, weil Sie dem Versand eines CO₂-Berichts zugestimmt haben.
                Details finden Sie in den Datenschutzhinweisen auf der Website.
              </td>
            </tr>
            <tr><td style="height:12px"></td></tr>
            <tr>
              <td style="text-align:center;color:${brand.textDim};font:600 12px/1 ${brand.font}">© Institute for AI Austria</td>
            </tr>
          </table>
          <!-- /container -->
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

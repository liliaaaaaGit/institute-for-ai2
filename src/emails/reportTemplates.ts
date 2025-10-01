// /src/emails/reportTemplates.ts

export type Comparison = { label: string; value: string };

export const brand = {
  red: "#D52100",
  dark: "#1C0202",
  bg: "#FFF2F0",
  card: "#FFFFFF",
  border: "rgba(213, 33, 0, 0.12)",
  badge: "#F6C7C0",
  radius: "14px",
  font: `Raleway, -apple-system, "Segoe UI", Arial, sans-serif`,
};

export const fmtDE = (n: number, max = 1) =>
  n.toLocaleString("de-DE", { maximumFractionDigits: max });

export const htmlEscape = (s = "") =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// simple list -> <ul> … </ul>
export const bullets = (items: string[]) =>
  `<ul style="margin:0;padding:0 0 0 20px;list-style:disc;color:${brand.dark};font:400 16px/1.55 ${brand.font}">
    ${items.map((i) => `<li style="margin:8px 0">${htmlEscape(i)}</li>`).join("")}
  </ul>`;

export const sectionTitle = (text: string) =>
  `<h2 style="margin:0 0 16px 0;font:700 20px/1.3 ${brand.font};color:${brand.dark}">${htmlEscape(
    text
  )}</h2>`;

export const pill = (label: string) =>
  `<span style="display:inline-block;background:${brand.badge};color:${brand.dark};padding:6px 12px;border-radius:999px;font:600 12px/1 ${brand.font}">${htmlEscape(
    label
  )}</span>`;

// Model-Guide-Daten (ohne Emojis)
export const modelGuide = [
  { name: "GPT-3.5", desc: "≈3 mg CO₂/Token – schnell, günstig", badge: "High" },
  { name: "Claude Haiku", desc: "≈3 mg/Token – effizient für Routine", badge: "High" },
  { name: "Llama 2/3 7–13B", desc: "≈3 mg/Token – flexibel/self-host", badge: "High" },
  { name: "Claude Sonnet / Gemini Pro", desc: "≈7,5 mg/Token – ausgewogen", badge: "Medium" },
  { name: "GPT-4 / Claude Opus", desc: "≈15 mg/Token – nur wenn nötig", badge: "Low" },
];

export const modelCards = () =>
  modelGuide
    .map(
      (m, i) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;margin:0 0 ${
    i === modelGuide.length - 1 ? "0" : "12px"
  } 0">
    <tr>
      <td style="background:${brand.card};border:1px solid ${brand.border};border-radius:${
        brand.radius
      };padding:16px 20px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
          <tr>
            <td style="font:600 16px/1.3 ${brand.font};color:${brand.dark};padding:0">${htmlEscape(
              m.name
            )}</td>
            <td style="text-align:right;padding:0">${pill(m.badge)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:4px;font:400 14px/1.55 ${brand.font};color:#666">${htmlEscape(
              m.desc
            )}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
    )
    .join("");

export const subjectFor = (model: string) => `Ihr CO₂-Bericht – ${model}`;

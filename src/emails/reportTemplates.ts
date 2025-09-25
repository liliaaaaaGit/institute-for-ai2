// /src/emails/reportTemplates.ts
export type Comparison = { label: string; value: string };

export const brand = {
  // Institute for AI Austria
  ink: "#1C0202",
  red: "#D52100",
  white: "#FFFFFF",

  // light mail theme
  pageBg: "#FFF6F5",                // very light red-tint
  cardBg: "#FFFFFF",
  borderSoft: "rgba(213,33,0,0.15)",

  // section tints (all red family; strongest first)
  tintStrong: "rgba(213,33,0,0.12)", // Quick Wins
  tintMid: "rgba(213,33,0,0.08)",    // Mid-term
  tintSoft: "rgba(213,33,0,0.05)",   // Advanced

  radius: "14px",
  font: `'Raleway', -apple-system, Segoe UI, Arial, sans-serif`,
};

export const fmtDE = (n: number, max = 1) =>
  n.toLocaleString("de-DE", { maximumFractionDigits: max });

export const htmlEscape = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const sectionTitle = (text: string) =>
  `<h3 style="margin:0 0 10px 0;font:700 18px/1.35 ${brand.font};color:${brand.ink}">${htmlEscape(text)}</h3>`;

export const bullets = (items: string[]) =>
  `<ul style="margin:0;padding:0 0 0 18px;font:400 14px/1.65 ${brand.font};color:${brand.ink}">
    ${items.map((i) => `<li style="margin:6px 0">${htmlEscape(i)}</li>`).join("")}
  </ul>`;

export const pill = (label: string) =>
  `<span style="display:inline-block;padding:6px 10px;border-radius:999px;border:1px solid ${brand.borderSoft};
           background:${brand.white};color:${brand.ink};font:700 11px/1 ${brand.font}">
     ${htmlEscape(label)}
   </span>`;

// Simple inline fallback logo (only used if no logoUrl is provided)
export const logoInlineSvg = `
<svg width="34" height="34" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Institute for AI Austria">
  <g fill="none" stroke="${brand.red}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 76 L48 18 L80 76" />
    <path d="M36 60 h20" />
    <path d="M72 24 v48" />
    <path d="M84 24 v48" />
  </g>
</svg>
`;

// Guidance lists (already approved)
export const quickWins = [
  "Kurze, präzise Prompts nutzen – unnötigen Kontext weglassen.",
  "Für einfache Aufgaben leichtere Modelle verwenden (z. B. GPT-3.5, Claude Haiku, Llama-7B).",
  "Ähnliche Fragen bündeln (Batching) statt viele einzelne Anfragen zu stellen.",
];

export const midTerm = [
  "Zwischenergebnisse cachen – wiederkehrende Berechnungen vermeiden.",
  "Nützliche Antworten speichern und wiederverwenden (z. B. eine kleine Snippet-Bibliothek).",
  "Bei Bild/Video: Auflösung und Schritte bewusst niedrig halten – nur bei Bedarf erhöhen.",
  "Wenn möglich, Ausführung in Zeiten mit geringerer Netz-Emission planen.",
];

export const advanced = [
  "„Right-Sizing“: Modelle pro Use-Case benchmarken – kleinere 7–13B-Modelle sind oft 5–10× effizienter.",
  "Streaming verwenden – früh abbrechen spart Tokens.",
  "System-/Few-Shot-Prompts stark verdichten; Beispiele auf das Minimum reduzieren.",
  "Monitoring etablieren: Tokens, g CO₂/Anfrage sowie Cache-Ersparnisse kontinuierlich messen.",
];

// Model guide (no emojis; one badge only)
export const modelGuide = [
  { name: "GPT-3.5", desc: "≈3 mg CO₂/Token – schnell, günstig", badge: "High" },
  { name: "Claude Haiku", desc: "≈3 mg/Token – effizient für Routine", badge: "High" },
  { name: "Llama 2/3 7–13B", desc: "≈3 mg/Token – flexibel/self-host", badge: "High" },
  { name: "Claude Sonnet / Gemini Pro", desc: "≈7,5 mg/Token – ausgewogen", badge: "Medium" },
  { name: "GPT-4 / Claude Opus", desc: "≈15 mg/Token – nur wenn nötig", badge: "Low" },
];

export const badge = (label: string) => {
  const bg =
    label === "High" ? "rgba(213,33,0,0.18)" : label === "Medium" ? "rgba(213,33,0,0.13)" : "rgba(213,33,0,0.10)";
  return `<span style="display:inline-block;padding:6px 10px;border-radius:999px;background:${bg};
               color:${brand.ink};font:700 11px/1 ${brand.font};border:1px solid ${brand.borderSoft}">
            ${htmlEscape(label)}
          </span>`;
};

export const modelCards = () =>
  modelGuide
    .map(
      (m) => `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 10px 0;border-collapse:separate">
  <tr>
    <td style="background:${brand.cardBg};border:1px solid ${brand.borderSoft};border-radius:${brand.radius};padding:14px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
        <tr>
          <td style="font:700 16px/1.35 ${brand.font};color:${brand.ink};padding:0">${htmlEscape(m.name)}</td>
          <td style="text-align:right;padding:0">${badge(m.badge)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top:6px;font:400 14px/1.6 ${brand.font};color:${brand.ink};opacity:.85">
            ${htmlEscape(m.desc)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
    )
    .join("");

export const subjectFor = (model: string) => `Ihr CO₂-Bericht – ${model}`;

// /src/emails/reportTemplates.ts

export type Comparison = { label: string; value: string };

/**
 * Brand & Theme – Light Mode:
 * - Ink/Text: #1C0202
 * - Red:      #D52100
 * - White:    #FFFFFF
 * - Soft BG:  #FFF7F6
 * - Soft Border: #F3D7D2
 */
export const brand = {
  bg: "#FFF7F6",               // Seitenhintergrund (dezent warm)
  card: "#FFFFFF",             // Karten/Boxen
  red: "#D52100",              // Primär-Rot
  text: "#1C0202",             // Haupttext
  textDim: "#1C0202CC",        // Gedimmter Text
  border: "#F3D7D2",           // zarte Rahmenfarbe
  radius: "16px",
  font: "Raleway, -apple-system, Segoe UI, Arial, sans-serif",
};

export const fmtDE = (n: number, max = 1) =>
  n.toLocaleString("de-DE", { maximumFractionDigits: max });

export const htmlEscape = (s = "") =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Standard Bullet-Liste für E-Mail-HTML (keine externen Styles). */
export const bullets = (items: string[]) =>
  `<ul style="margin:0;padding:0 0 0 18px;color:${brand.text};font:400 14px/1.6 ${brand.font}">
    ${items.map((i) => `<li style="margin:6px 0">${htmlEscape(i)}</li>`).join("")}
  </ul>`;

/** Sektionstitel – optional auf rotem Untergrund (weiß setzen). */
export const sectionTitle = (text: string, onRed = false) =>
  `<h3 style="margin:0 0 12px 0;font:800 18px/1.3 ${brand.font};letter-spacing:.2px;color:${
    onRed ? "#FFFFFF" : brand.text
  }">${htmlEscape(text)}</h3>`;

/** Neutrales Pill/Tag. */
export const pill = (label: string) =>
  `<span style="
      display:inline-block;padding:6px 10px;border-radius:999px;
      background:#FCEAE7;color:${brand.text};border:1px solid ${brand.border};
      font:600 12px/1 ${brand.font};">${htmlEscape(label)}
    </span>`;

/** Minimal-Logo als Fallback (nur falls kein externes Bild eingebunden wird). */
export const logoInlineSvg = `
  <svg width="40" height="40" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Institute for AI Austria">
    <g fill="none" stroke="${brand.red}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 76 L48 18 L80 76" />
      <path d="M36 60 h20" />
      <path d="M68 24 v48" />
      <path d="M80 24 v48" />
    </g>
  </svg>
`;

/* ------------------------------------------------------------------ */
/* Inhalte (Texte so gelassen/feingeschliffen wie besprochen)         */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Model Efficiency Guide                                              */
/* ------------------------------------------------------------------ */

export const modelGuide = [
  { name: "GPT-3.5 ⚡",                desc: "≈3 mg CO₂/Token – schnell, günstig",             badge: "High"   },
  { name: "Claude Haiku 🌸",          desc: "≈3 mg/Token – effizient für Routine",             badge: "High"   },
  { name: "Llama 2/3 7–13B 🦙",       desc: "≈3 mg/Token – flexibel/self-host",                badge: "High"   },
  { name: "Claude Sonnet / Gemini Pro", desc: "≈7,5 mg/Token – ausgewogen",                   badge: "Medium" },
  { name: "GPT-4 / Claude Opus",      desc: "≈15 mg/Token – nur wenn nötig",                   badge: "Low"    },
];

/** Badge in Light-Theme (dezente Pastell-Hintergründe). */
export const badge = (label: string) => {
  const bg =
    label === "High"   ? "#EDE1DF" :
    label === "Medium" ? "#EFE7E5" :
                         "#F1ECEB";
  return `<span style="
      display:inline-block;padding:6px 10px;border-radius:999px;
      background:${bg};color:${brand.text};border:1px solid ${brand.border};
      font:700 11px/1 ${brand.font}">${htmlEscape(label)}
    </span>`;
};

/** Kartenliste für den Model Guide (E-Mail-kompatibel, ohne externes CSS). */
export const modelCards = () =>
  modelGuide
    .map(
      (m) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 12px 0;border-collapse:separate">
    <tr>
      <td style="background:${brand.card};border:1px solid ${brand.border};border-radius:${brand.radius};padding:16px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
          <tr>
            <td style="font:700 16px/1.3 ${brand.font};color:${brand.text};padding:0">${htmlEscape(m.name)}</td>
            <td style="text-align:right;padding:0">${badge(m.badge)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:6px;font:400 14px/1.6 ${brand.font};color:${brand.textDim}">${htmlEscape(m.desc)}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
    )
    .join("");

export const subjectFor = (model: string) => `Ihr CO₂-Bericht – ${model}`;

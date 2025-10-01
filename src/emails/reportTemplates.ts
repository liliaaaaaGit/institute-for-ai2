// /src/emails/reportTemplates.ts

export type Comparison = { label: string; value: string };

// ===== Brand & Design =====
export const brand = {
  bg: "#FFF2F0",                // Light rose background
  card: "#FFFFFF",              // White cards
  border: "rgba(213, 33, 0, 0.12)",
  red: "#D52100",               // Institute red
  text: "#1C0202",              // Dark text
  textDim: "#6A5E5C",           // Muted body text
  radius: "14px",
  font: 'Raleway, -apple-system, "Segoe UI", Arial, sans-serif',
};

// ===== Helpers =====
export const fmtDE = (n: number, max = 1) =>
  n.toLocaleString("de-DE", { maximumFractionDigits: max });

export const htmlEscape = (s = "") =>
  s.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const sectionTitle = (text: string) =>
  `<h2 style="font:700 20px/1.3 ${brand.font};color:${brand.text};margin:0 0 16px 0">${htmlEscape(text)}</h2>`;

export const cardWrapOpen = (extra = "") =>
  `<div style="background:${brand.card};border:1px solid ${brand.border};border-radius:${brand.radius};padding:20px;${extra}">`;
export const cardWrapClose = `</div>`;

export const listBullets = (items: string[]) =>
  `<ul style="margin:0;padding:0 0 0 20px;list-style:disc">
    ${items
      .map(
        (i) =>
          `<li style="margin:8px 0;font:400 16px/1.55 ${brand.font};color:${brand.text}">${htmlEscape(
            i
          )}</li>`
      )
      .join("")}
  </ul>`;

export const subjectFor = (model?: string) =>
  `Ihr CO₂-Bericht – ${model || "GPT-4"}`;

// ===== Inhalte =====
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

export const modelGuide = [
  { name: "GPT-3.5", desc: "≈3 mg CO₂/Token – schnell, günstig", badge: "High" },
  { name: "Claude Haiku", desc: "≈3 mg/Token – effizient für Routine", badge: "High" },
  { name: "Llama 2/3 7–13B", desc: "≈3 mg/Token – flexibel/self-host", badge: "High" },
  { name: "Claude Sonnet / Gemini Pro", desc: "≈7,5 mg/Token – ausgewogen", badge: "Medium" },
  { name: "GPT-4 / Claude Opus", desc: "≈15 mg/Token – nur wenn nötig", badge: "Low" },
];

export const badge = (label: "High" | "Medium" | "Low") => {
  const bg =
    label === "High" ? "#F6C7C0" : label === "Medium" ? "#F6DCCC" : "#E9CCD0";
  return `<span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${bg};color:${brand.text};font:600 12px/1 ${brand.font}">${label}</span>`;
};

export const modelCardsHtml = () =>
  modelGuide
    .map(
      (m, i, arr) => `
<div style="background:${brand.card};border:1px solid ${brand.border};border-radius:${brand.radius};padding:16px 20px;margin:0 0 ${i === arr.length - 1 ? "0" : "12px"} 0;display:flex;justify-content:space-between;align-items:flex-start">
  <div style="flex:1">
    <h4 style="margin:0 0 4px 0;font:600 16px/1.3 ${brand.font};color:${brand.text}">${htmlEscape(m.name)}</h4>
    <p style="margin:0;font:400 14px/1.5 ${brand.font};color:${brand.textDim}">${htmlEscape(m.desc)}</p>
  </div>
  ${badge(m.badge as any)}
</div>`
    )
    .join("");

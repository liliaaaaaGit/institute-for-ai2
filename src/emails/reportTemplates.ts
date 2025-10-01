// /src/emails/EmailTemplate.tsx
import * as React from "react";

type Props = {
  model?: string;
  co2?: string;              // z.B. "45.6"
  tokens?: string;           // z.B. "3.040"
  pcMinutes?: string;        // z.B. "8.2"
  carMeters?: string;        // z.B. "180"
  householdMinutes?: string; // z.B. "12.5"
  phoneCharges?: string;     // z.B. "1.2"
  ledHours?: string;         // z.B. "76"
};

const colors = {
  brandRed: "#D52100",
  textDark: "#1C0202",
  textDim: "#666666",
  border: "rgba(213, 33, 0, 0.12)",
  bgSoft: "#FFF2F0",
  badge: "#F6C7C0",
  card: "#FFFFFF",
};

const fontStack =
  'Raleway, -apple-system, "Segoe UI", Roboto, Arial, Helvetica, sans-serif';

export default function EmailTemplate({
  model = "GPT-4",
  co2 = "45,6",
  tokens = "3.040",
  pcMinutes = "8,2",
  carMeters = "180",
  householdMinutes = "12,5",
  phoneCharges = "1,2",
  ledHours = "76",
}: Props) {
  return (
    <div
      style={{
        fontFamily: fontStack,
        maxWidth: 600,
        margin: "0 auto",
        background: colors.bgSoft,
      }}
    >
      {/* Header-Band */}
      <div style={{ background: colors.brandRed, padding: "16px 24px" }}>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>
          Institute for AI
        </div>
      </div>

      {/* Titel */}
      <div style={{ padding: "32px 24px 24px" }}>
        <h1
          style={{
            fontFamily: fontStack,
            fontSize: 28,
            fontWeight: 700,
            color: colors.textDark,
            margin: "0 0 8px 0",
            letterSpacing: -0.5,
          }}
        >
          Ihr CO₂-Bericht – {model}
        </h1>
        <p style={{ fontSize: 16, color: colors.textDim, margin: 0 }}>
          Institute for AI
        </p>
      </div>

      {/* Zusammenfassung */}
      <SectionPad>
        <Card>
          <H2>Zusammenfassung</H2>
          <p style={{ fontSize: 16, color: colors.textDark, margin: 0, lineHeight: 1.5 }}>
            Geschätzter CO₂-Ausstoß: <strong>{co2} g CO₂</strong> (Modell: {model}, Tokens: {tokens}).
          </p>
        </Card>
      </SectionPad>

      {/* Alltagsvergleiche */}
      <div style={{ padding: "0 24px 32px" }}>
        <H2>Alltagsvergleiche</H2>
        <table
          style={{
            width: "100%",
            border: `1px solid ${colors.border}`,
            borderRadius: 14,
            borderCollapse: "separate",
            borderSpacing: 0,
            background: colors.card,
          }}
        >
          <tbody>
            <Row label="Desktop-PC" value={`${pcMinutes} Minuten`} first />
            <Row label="Autofahrt (Benzin)" value={`${carMeters} Meter`} />
            <Row label="Haushaltsstrom" value={`${householdMinutes} Minuten`} />
            <Row label="Smartphone" value={`${phoneCharges} Aufladungen`} />
            <Row label="LED-Lampe (10 W)" value={`${ledHours} Stunden`} last />
          </tbody>
        </table>
      </div>

      {/* CO2-Optimierung */}
      <div style={{ padding: "0 24px 24px" }}>
        <H2>CO₂-Optimierung</H2>
      </div>

      <div style={{ padding: "0 24px 32px" }}>
        <ActionCard
          title="Quick Wins (sofort)"
          bg="#FFE3DE"
          items={[
            "Kurze, präzise Prompts nutzen – unnötigen Kontext weglassen.",
            "Für einfache Aufgaben leichtere Modelle verwenden (z. B. GPT-3.5, Claude Haiku, Llama-7B).",
            "Ähnliche Fragen bündeln (Batching) statt viele einzelne Anfragen zu stellen.",
          ]}
        />
        <ActionCard
          title="Mittelfristig (Prozess & Setup)"
          bg="#FFD6CF"
          items={[
            "Zwischenergebnisse cachen – wiederkehrende Berechnungen vermeiden.",
            "Nützliche Antworten speichern und wiederverwenden (z. B. eine kleine Snippet-Bibliothek).",
            "Bei Bild/Video: Auflösung und Schritte bewusst niedrig halten – nur bei Bedarf erhöhen.",
            "Wenn möglich, Ausführung in Zeiten mit geringerer Netz-Emission planen.",
          ]}
        />
        <ActionCard
          title="Fortgeschritten (Power-User)"
          bg="#FFC9C1"
          items={[
            "Right-Sizing: Modelle pro Use-Case benchmarken – kleinere 7–13B-Modelle sind oft 5–10× effizienter.",
            "Streaming verwenden – früh abbrechen spart Tokens.",
            "System-/Few-Shot-Prompts stark verdichten; Beispiele auf das Minimum reduzieren.",
            "Monitoring etablieren: Tokens, g CO₂/Anfrage sowie Cache-Ersparnisse kontinuierlich messen.",
          ]}
        />
      </div>

      {/* Model Efficiency Guide */}
      <div style={{ padding: "0 24px 32px" }}>
        <H2>Model Efficiency Guide</H2>
        <ModelCard
          model="GPT-3.5"
          efficiency="High"
          desc="≈3 mg CO₂/Token – schnell, günstig"
        />
        <ModelCard
          model="Claude Haiku"
          efficiency="High"
          desc="≈3 mg/Token – effizient für Routine"
        />
        <ModelCard
          model="Llama 2/3 7–13B"
          efficiency="High"
          desc="≈3 mg/Token – flexibel/self-host"
        />
        <ModelCard
          model="Claude Sonnet / Gemini Pro"
          efficiency="Medium"
          desc="≈7,5 mg/Token – ausgewogen"
        />
        <ModelCard
          model="GPT-4 / Claude Opus"
          efficiency="Low"
          desc="≈15 mg/Token – nur wenn nötig"
          last
        />
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 24,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: colors.textDim,
            margin: "0 0 12px 0",
            lineHeight: 1.4,
          }}
        >
          <strong>Datenschutzhinweis:</strong> Sie erhalten diese E-Mail, weil Sie dem
          Versand eines CO₂-Berichts zugestimmt haben. Details finden Sie in den
          Datenschutzhinweisen auf der Website (https://institute-for-ai.com/impressum-datenschutz).
        </p>
        <p style={{ fontSize: 14, color: colors.textDim, margin: 0 }}>© Institute for AI</p>
      </div>
    </div>
  );
}

/* ---------- kleine Hilfs-Komponenten ---------- */

function SectionPad({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "0 24px 24px" }}>{children}</div>;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: fontStack,
        fontSize: 20,
        fontWeight: 700,
        color: colors.textDark,
        margin: "0 0 16px 0",
      }}
    >
      {children}
    </h2>
  );
}

function Row({
  label,
  value,
  first,
  last,
}: {
  label: string;
  value: string;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          padding: "16px 20px",
          fontSize: 16,
          color: colors.textDark,
          borderBottom: last ? "none" : `1px solid ${colors.border}`,
          fontWeight: 400,
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "16px 20px",
          fontSize: 16,
          color: colors.textDark,
          borderBottom: last ? "none" : `1px solid ${colors.border}`,
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {value}
      </td>
    </tr>
  );
}

function ActionCard({
  title,
  bg,
  items,
}: {
  title: string;
  bg: string;
  items: string[];
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <h3
        style={{
          fontFamily: fontStack,
          fontSize: 18,
          fontWeight: 700,
          color: colors.textDark,
          margin: "0 0 16px 0",
        }}
      >
        {title}
      </h3>
      <ul style={{ margin: 0, paddingLeft: 20, listStyleType: "disc" }}>
        {items.map((t, i) => (
          <li
            key={i}
            style={{ fontSize: 16, color: colors.textDark, marginBottom: 8, lineHeight: 1.5 }}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModelCard({
  model,
  efficiency,
  desc,
  last,
}: {
  model: string;
  efficiency: "High" | "Medium" | "Low";
  desc: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: "16px 20px",
        marginBottom: last ? 0 : 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: 1 }}>
        <h4
          style={{
            fontFamily: fontStack,
            fontSize: 16,
            fontWeight: 600,
            color: colors.textDark,
            margin: "0 0 4px 0",
          }}
        >
          {model}
        </h4>
        <p style={{ fontSize: 14, color: colors.textDim, margin: 0 }}>{desc}</p>
      </div>
      <span
        style={{
          background: colors.badge,
          color: colors.textDark,
          padding: "6px 12px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          marginLeft: 16,
          whiteSpace: "nowrap",
        }}
      >
        {efficiency}
      </span>
    </div>
  );
}

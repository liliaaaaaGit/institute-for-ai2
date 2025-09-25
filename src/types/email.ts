export type EmailReportInput = {
  to: string;                 // recipient (confirmed lead)
  sessionId: string;          // for deep link (optional)
  sessionDateISO: string;     // e.g., new Date().toISOString()
  co2Grams: number;           // total estimated g CO2
  tokens: number;             // input+output
  modelName: string;          // e.g. "GPT-4"
  provider: string;           // e.g. "OpenAI"
  promptExcerpt: string;      // first ~200 chars
  comparisons: {              // precomputed values from your buildComparisons()
    pc: string;               // e.g., "12,7 Stunden"
    car: string;              // e.g., "5,1 Kilometer"
    household: string;        // e.g., "4,8 Stunden"
    phone: string;            // e.g., "318,4 Aufladungen"
    led: string;              // e.g., "8 Tage"
  };
  modelEfficiencyRows: Array<{ name: string; gPer1k: string; bestFor: string }>;
  altModelSuggestion?: { name: string; gPer1k: string }; // optional "lighter model"
  methodologyVersionDate: string; // e.g., "September 2025"
  links: {
    session?: string;         // deep link to read-only session page
    compare?: string;         // CTA link "Weitere Modelle testen"
    unsubscribe: string;
    privacy: string;
  };
};
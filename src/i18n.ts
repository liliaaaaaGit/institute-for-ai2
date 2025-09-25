export const dict = {
  en: {}, // optional
  de: {
    // App
    "app.title": "Messe den CO₂-Impact deiner Prompts",
    "app.subtitle": "Finde heraus, wie sich verschiedene AI models auf deinen CO₂-Wert auswirken",
    
    // Navigation
    "nav.home": "Start",
    "nav.report": "Bericht",
    
    // Form
    "form.inputMethod": "Eingabemethode",
    "form.pastePrompt": "Prompt einfügen",
    "form.enterTokens": "Tokens eingeben",
    "form.aiPrompt": "KI-Prompt",
    "form.tokenCount": "Token-Anzahl",
    "form.aiModel": "KI-Modell",
    "form.calculate": "CO₂-Fußabdruck berechnen",
    "form.calculating": "Berechne...",
    "form.placeholderPrompt": "Fügen Sie hier Ihren KI-Prompt ein...",
    "form.placeholderTokens": "Token-Anzahl eingeben",
    "form.selectModel": "Modell auswählen...",
    "form.tokensEstimated": "~{{count}} Tokens geschätzt",
    
    // Token info
    "tokens.whatAre": "Was sind Tokens?",
    "tokens.explanation": "Tokens sind Wortteile, die von KI-Modellen verwendet werden. Ungefähr:",
    "tokens.ratio1": "1 Token ≈ 4 Zeichen",
    "tokens.ratio2": "1 Wort ≈ 1-2 Tokens",
    "tokens.ratio3": "100 Wörter ≈ 75-100 Tokens",
    
    // Results
    "result.title": "Ergebnis",
    "result.grams": "{{value}} Gramm CO₂",
    "result.comparisons": "Vergleiche aus dem Alltag",
    "result.shareTitle": "Dieses Ergebnis teilen",
    "result.shareDesc": "Link kopieren, um Berechnung zu teilen",
    "result.copyLink": "Link kopieren",
    "result.linkCopied": "Link in die Zwischenablage kopiert!",
    "result.showMore": "{{count}} weitere anzeigen",
    "result.showLess": "Weniger anzeigen",
    
    // Lead modal
    "lead.title": "Bericht erhalten",
    "lead.email": "E-Mail-Adresse",
    "lead.emailPlaceholder": "ihre@email.de",
    "lead.consentRequired": "Ich möchte den CO₂-Bericht per E-Mail erhalten und stimme der Verarbeitung meiner Daten laut Datenschutzhinweisen zu.",
    "lead.consentMarketing": "Ich möchte Tipps zur Reduzierung des KI-CO₂-Fußabdrucks und Updates zu nachhaltigen KI-Praktiken erhalten (optional).",
    "lead.privacyPolicy": "Datenschutzhinweisen",
    "lead.doubleOptIn": "Double-Opt-In erforderlich",
    "lead.doubleOptInDesc": "Wir senden Ihnen eine Bestätigungs-E-Mail. Klicken Sie auf den Link, um Ihren detaillierten Bericht zu erhalten.",
    "lead.cancel": "Abbrechen",
    "lead.getReport": "Bericht erhalten",
    "lead.sending": "Sende...",
    
    // Thanks page
    "thanks.title": "Prüfen Sie Ihre E-Mails!",
    "thanks.subtitle": "Wir haben eine Bestätigungs-E-Mail zur Verifizierung Ihrer Adresse gesendet.",
    "thanks.whatsNext": "Was kommt als nächstes?",
    "thanks.step1": "Prüfen Sie Ihr E-Mail-Postfach (und den Spam-Ordner)",
    "thanks.step2": "Klicken Sie auf den Bestätigungslink in unserer E-Mail",
    "thanks.step3": "Erhalten Sie Ihren detaillierten CO₂-Analysebericht",
    "thanks.reportIncludes": "Ihr Bericht enthält:",
    "thanks.reportItem1": "• Detaillierte CO₂-Aufschlüsselung und Methodik",
    "thanks.reportItem2": "• Vergleich mit Branchenbenchmarks",
    "thanks.reportItem3": "• Empfehlungen zur Reduzierung von KI-Emissionen",
    "thanks.reportItem4": "• Exportoptionen (PDF, CSV)",
    "thanks.backToCalculator": "Weiteren Prompt berechnen",
    "thanks.noEmail": "E-Mail nicht erhalten? Prüfen Sie Ihren Spam-Ordner oder versuchen Sie es in ein paar Minuten erneut.",
    
    // Confirm page
    "confirm.title": "E-Mail bestätigt!",
    "confirm.subtitle": "Ihr detaillierter CO₂-Bericht wird vorbereitet und in Kürze an Ihre E-Mail gesendet.",
    "confirm.reportIncludes": "Ihr Bericht enthält:",
    "confirm.reportItem1": "• Vollständige CO₂-Berechnungsmethodik",
    "confirm.reportItem2": "• Detaillierte Modellanalyse und Vergleiche",
    "confirm.reportItem3": "• Branchenbenchmark-Daten",
    "confirm.reportItem4": "• Umsetzbare Empfehlungen",
    "confirm.reportItem5": "• Exportformate (PDF, CSV, JSON)",
    "confirm.subscriberBenefits": "Als bestätigter Abonnent erhalten Sie auch:",
    "confirm.benefit1": "• Monatliche Tipps für nachhaltige KI-Nutzung",
    "confirm.benefit2": "• Updates zu neuen Berechnungsmodellen",
    "confirm.benefit3": "• Frühen Zugang zu neuen Funktionen",
    "confirm.benefit4": "• Vierteljährliche Nachhaltigkeitsberichte",
    "confirm.backToCalculator": "Weiteren Prompt berechnen",
    "confirm.deliveryNote": "Die Berichtszustellung kann einige Minuten dauern. Vielen Dank, dass Sie dabei helfen, KI nachhaltiger zu machen!",
    "confirm.failed": "Bestätigung fehlgeschlagen",
    "confirm.failedDesc": "Der Bestätigungslink ist ungültig oder abgelaufen.",
    "confirm.confirming": "Bestätige Ihre E-Mail...",
    
    // Report page
    "report.title": "CO₂-Berechnungsbericht",
    "report.subtitle": "Detaillierte Analyse des CO₂-Fußabdrucks Ihres KI-Prompts",
    "report.notFound": "Bericht nicht gefunden",
    "report.notFoundDesc": "Der angeforderte Bericht konnte nicht gefunden werden oder ist abgelaufen.",
    "report.reportId": "Bericht-ID: {{id}}",
    "report.loading": "Lade Bericht...",
    "report.calculationDetails": "Berechnungsdetails",
    "report.inputMethod": "Eingabemethode",
    "report.tokenCount": "Token-Anzahl",
    "report.emissionFactor": "Modell-Emissionsfaktor",
    "report.totalEmissions": "Gesamtemissionen",
    "report.calculationFormula": "Berechnungsformel",
    "report.comparisons": "Vergleiche aus dem Alltag",
    "report.originalPrompt": "Ursprünglicher Prompt",
    "report.shareReport": "Diesen Bericht teilen",
    "report.shareDesc": "Link kopieren, um diese Berechnung zu teilen",
    "report.copyLink": "Link kopieren",
    "report.shareButton": "Bericht teilen",
    "report.methodology": "Methodik",
    "report.methodologyCalc": "**Berechnung:** CO₂-Emissionen werden durch Multiplikation der Token-Anzahl mit dem Emissionsfaktor des Modells ({{factor}}g CO₂ pro 1.000 Tokens) berechnet.",
    "report.methodologyTokens": "**Token-Schätzung:** {{method}}",
    "report.methodologyTokensPrompt": "Tokens werden mit etwa 4 Zeichen pro Token für Texteingaben geschätzt.",
    "report.methodologyTokensUser": "Token-Anzahl wurde direkt vom Benutzer bereitgestellt.",
    "report.methodologyFactors": "**Emissionsfaktoren:** Basierend auf Branchenforschung und können je nach tatsächlicher Infrastruktur, Modelltraining und Nutzungsmustern variieren.",
    "report.methodologyComparisons": "**Vergleiche:** Alltagsäquivalente werden mit Standardemissionsfaktoren für häufige Aktivitäten und Geräte berechnet.",
    "report.generatedOn": "Bericht-ID: {{id}} • Erstellt am {{date}}",
    
    // Info cards
    "info.instantCalc": "Sofortberechnung",
    "info.instantCalcDesc": "Erhalten Sie sofortige CO₂-Schätzungen für Ihre Prompts oder Token-Anzahlen",
    "info.multipleModels": "Mehrere Modelle",
    "info.multipleModelsDesc": "Unterstützung für GPT-4, Claude, Gemini und andere beliebte KI-Modelle",
    "info.detailedReports": "Detaillierte Berichte",
    "info.detailedReportsDesc": "Erhalten Sie umfassende Analysen und exportieren Sie Daten per E-Mail",
    
    // CTA
    "cta.getReport": "Detaillierten CO₂-Bericht per E-Mail erhalten",
    "cta.getReportDesc": "Kostenlose detaillierte Analyse, Benchmarks und Exportoptionen",
    
    // Transparency
    "transparency.title": "Transparenzhinweis:",
    "transparency.text": "Dies sind nur Schätzungen. Tatsächliche Emissionen variieren je nach Modelltraining, Infrastruktur und Nutzungsmustern. Unsere Berechnungen basieren auf Branchenforschung und spiegeln möglicherweise nicht die Echtzeitemissionen wider.",
    
    // Comparisons
    "comparison.pcUsage": "Desktop-PC-Nutzung",
    "comparison.carTravel": "Autofahrt",
    "comparison.electricity": "Haushaltsstrom",
    "comparison.smartphoneCharge": "Smartphone-Aufladungen",
    "comparison.ledBulb": "LED-Lampen-Nutzung",
    
    // Time formats
    "time.seconds": "{{count}} Sekunden",
    "time.second": "{{count}} Sekunde",
    "time.minutes": "{{count}} Minuten",
    "time.minute": "{{count}} Minute",
    "time.hours": "{{count}} Stunden",
    "time.hour": "{{count}} Stunde",
    "time.days": "{{count}} Tage",
    "time.day": "{{count}} Tag",
    
    // Units
    "unit.meters": "Meter",
    "unit.km": "km",
    "unit.charges": "Aufladungen",
    "unit.charge": "Aufladung",
    "unit.percent": "% von 1 {{unit}}",
    
    // Equivalents
    "equivalent.pcUsage": "Entspricht {{time}} Desktop-PC-Nutzung",
    "equivalent.carTravel": "Entspricht {{distance}} Autofahrt mit Benzinfahrzeug",
    "equivalent.smartphoneCharge": "Entspricht {{percent}}% Smartphone-Aufladung",
    "equivalent.smartphoneCharges": "Entspricht {{count}}-maliger vollständiger Smartphone-Aufladung",
    "equivalent.ledBulb": "Entspricht {{time}} LED-Lampen-Nutzung",
    "equivalent.electricity": "Entspricht {{time}} Haushaltsstrom",
    
    // Errors
    "error.required": "Dieses Feld ist erforderlich",
    "error.invalidEmail": "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    "error.calculation": "Berechnung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    "error.invalidModel": "Bitte wählen Sie ein gültiges KI-Modell aus",
    
    // Common
    "common.cancel": "Abbrechen",
    "common.submit": "Senden",
    "common.close": "Schließen",
    "common.back": "Zurück",
    "common.loading": "Lädt...",
    "common.error": "Fehler",
    "common.success": "Erfolg"
  }
} as const;

export const t = (k: keyof typeof dict["de"], vars?: Record<string, string|number>) => {
  let s = dict.de[k] ?? String(k);
  if (vars) {
    for (const [key, val] of Object.entries(vars)) {
      s = s.replace(`{{${key}}}`, String(val));
    }
  }
  return s;
};

// German number formatting
export const formatNumber = (num: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

// German date formatting
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

export const formatDateShort = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('de-DE').format(d);
};
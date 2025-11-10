// Enhanced i18n system with bilingual support (German/English)

export type Language = 'de' | 'en';

export const translations = {
  de: {
    // App
    "app.title": "Messe den CO₂-Impact deiner Prompts",
    "app.subtitle": "Finde heraus, wie sich verschiedene AI models auf deinen CO₂-Wert auswirken",
    
    // Navigation
    "nav.home": "Start",
    "nav.report": "Bericht",
    "nav.language": "Sprache",
    "nav.languageSwitch": "Zu Englisch wechseln",
    
    // Form
    "form.inputMethod": "Eingabemethode",
    "form.pastePrompt": "Prompt einfügen",
    "form.enterTokens": "Tokens eingeben",
    "form.aiPrompt": "KI-Prompt",
    "form.tokenCount": "Token-Anzahl",
    "form.aiModel": "KI-Modell",
    "form.calculate": "Berechnen & detaillierten CO₂-Bericht erhalten",
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
    "lead.cancel": "Abbrechen",
    "lead.getReport": "Bericht erhalten",
    "lead.sending": "Sende...",
    
    // Thanks page
    "thanks.title": "Prüfen Sie Ihre E-Mails!",
    "thanks.subtitle": "Ihr detaillierter CO₂-Bericht ist auf dem Weg zu Ihnen!",
    "thanks.reportIncludes": "Ihr Bericht enthält:",
    "thanks.reportItem1": "• Detaillierte CO₂-Aufschlüsselung und Methodik",
    "thanks.reportItem2": "• Vergleich mit Branchenbenchmarks",
    "thanks.reportItem3": "• Empfehlungen zur Reduzierung von KI-Emissionen",
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
    "report.backToCalculator": "Zurück zum Rechner",
    
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
    "common.success": "Erfolg",

    // Email content
    "email.subject": "Ihr CO₂-Bericht – {{model}}",
    "email.summary": "Zusammenfassung",
    "email.estimatedEmissions": "Geschätzter CO₂-Ausstoß: {{grams}} g CO₂",
    "email.modelTokens": "Modell: {{model}}, Tokens: {{tokens}}",
    "email.comparisons": "Alltagsvergleiche",
    "email.optimization": "CO₂-Optimierung",
    "email.quickWins": "Quick Wins (sofort)",
    "email.midTerm": "Mittelfristig (Prozess & Setup)",
    "email.advanced": "Fortgeschritten (Power-User)",
    "email.modelGuide": "Model Efficiency Guide",
    "email.privacyNote": "Sie erhalten diese E-Mail, weil Sie dem Versand eines CO₂-Berichts zugestimmt haben.",
    "email.copyright": "© Institute for AI",

    // Comparison labels for email
    "email.comparison.pc": "Desktop-PC",
    "email.comparison.car": "Autofahrt (Benzin)",
    "email.comparison.household": "Haushaltsstrom", 
    "email.comparison.phone": "Smartphone",
    "email.comparison.led": "LED-Lampe (10 W)",
    "email.comparison.pcUnit": "Minuten",
    "email.comparison.carUnit": "Meter",
    "email.comparison.householdUnit": "Minuten",
    "email.comparison.phoneUnit": "Aufladungen",
    "email.comparison.ledUnit": "Stunden"
  },
  en: {
    // App
    "app.title": "Measure the CO₂ Impact of Your Prompts",
    "app.subtitle": "Discover how different AI models affect your carbon footprint",
    
    // Navigation
    "nav.home": "Home",
    "nav.report": "Report",
    "nav.language": "Language",
    "nav.languageSwitch": "Switch to German",
    
    // Form
    "form.inputMethod": "Input Method",
    "form.pastePrompt": "Paste Prompt",
    "form.enterTokens": "Enter Tokens",
    "form.aiPrompt": "AI Prompt",
    "form.tokenCount": "Token Count",
    "form.aiModel": "AI Model",
    "form.calculate": "Calculate & Get Detailed CO₂ Report",
    "form.calculating": "Calculating...",
    "form.placeholderPrompt": "Paste your AI prompt here...",
    "form.placeholderTokens": "Enter token count",
    "form.selectModel": "Select model...",
    "form.tokensEstimated": "~{{count}} tokens estimated",
    
    // Token info
    "tokens.whatAre": "What are Tokens?",
    "tokens.explanation": "Tokens are word parts used by AI models. Approximately:",
    "tokens.ratio1": "1 token ≈ 4 characters",
    "tokens.ratio2": "1 word ≈ 1-2 tokens",
    "tokens.ratio3": "100 words ≈ 75-100 tokens",
    
    // Results
    "result.title": "Result",
    "result.grams": "{{value}} grams CO₂",
    "result.comparisons": "Real-world Comparisons",
    "result.shareTitle": "Share this Result",
    "result.shareDesc": "Copy link to share calculation",
    "result.copyLink": "Copy Link",
    "result.linkCopied": "Link copied to clipboard!",
    "result.showMore": "Show {{count}} more",
    "result.showLess": "Show less",
    
    // Lead modal
    "lead.title": "Get Report",
    "lead.email": "Email Address",
    "lead.emailPlaceholder": "your@email.com",
    "lead.consentRequired": "I want to receive the CO₂ report via email and agree to the processing of my data according to the privacy policy.",
    "lead.consentMarketing": "I would like to receive tips for reducing AI CO₂ footprint and updates on sustainable AI practices (optional).",
    "lead.cancel": "Cancel",
    "lead.getReport": "Get Report",
    "lead.sending": "Sending...",
    
    // Thanks page
    "thanks.title": "Check Your Email!",
    "thanks.subtitle": "Your detailed CO₂ report is on its way to you!",
    "thanks.reportIncludes": "Your report includes:",
    "thanks.reportItem1": "• Detailed CO₂ breakdown and methodology",
    "thanks.reportItem2": "• Industry benchmark comparisons",
    "thanks.reportItem3": "• Recommendations for reducing AI emissions",
    "thanks.backToCalculator": "Calculate Another Prompt",
    "thanks.noEmail": "Didn't receive the email? Check your spam folder or try again in a few minutes.",
    
    // Confirm page
    "confirm.title": "Email Confirmed!",
    "confirm.subtitle": "Your detailed CO₂ report is being prepared and will be sent to your email shortly.",
    "confirm.reportIncludes": "Your report includes:",
    "confirm.reportItem1": "• Complete CO₂ calculation methodology",
    "confirm.reportItem2": "• Detailed model analysis and comparisons",
    "confirm.reportItem3": "• Industry benchmark data",
    "confirm.reportItem4": "• Actionable recommendations",
    "confirm.reportItem5": "• Export formats (PDF, CSV, JSON)",
    "confirm.subscriberBenefits": "As a confirmed subscriber, you'll also receive:",
    "confirm.benefit1": "• Monthly tips for sustainable AI usage",
    "confirm.benefit2": "• Updates on new calculation models",
    "confirm.benefit3": "• Early access to new features",
    "confirm.benefit4": "• Quarterly sustainability reports",
    "confirm.backToCalculator": "Calculate Another Prompt",
    "confirm.deliveryNote": "Report delivery may take a few minutes. Thank you for helping make AI more sustainable!",
    "confirm.failed": "Confirmation Failed",
    "confirm.failedDesc": "The confirmation link is invalid or has expired.",
    "confirm.confirming": "Confirming your email...",
    
    // Report page
    "report.title": "CO₂ Calculation Report",
    "report.subtitle": "Detailed analysis of your AI prompt's carbon footprint",
    "report.notFound": "Report Not Found",
    "report.notFoundDesc": "The requested report could not be found or has expired.",
    "report.reportId": "Report ID: {{id}}",
    "report.loading": "Loading report...",
    "report.calculationDetails": "Calculation Details",
    "report.inputMethod": "Input Method",
    "report.tokenCount": "Token Count",
    "report.emissionFactor": "Model Emission Factor",
    "report.totalEmissions": "Total Emissions",
    "report.calculationFormula": "Calculation Formula",
    "report.comparisons": "Real-world Comparisons",
    "report.originalPrompt": "Original Prompt",
    "report.shareReport": "Share This Report",
    "report.shareDesc": "Copy link to share this calculation",
    "report.copyLink": "Copy Link",
    "report.shareButton": "Share Report",
    "report.methodology": "Methodology",
    "report.methodologyCalc": "**Calculation:** CO₂ emissions are calculated by multiplying the token count with the model's emission factor ({{factor}}g CO₂ per 1,000 tokens).",
    "report.methodologyTokens": "**Token Estimation:** {{method}}",
    "report.methodologyTokensPrompt": "Tokens are estimated at approximately 4 characters per token for text inputs.",
    "report.methodologyTokensUser": "Token count was provided directly by the user.",
    "report.methodologyFactors": "**Emission Factors:** Based on industry research and may vary depending on actual infrastructure, model training, and usage patterns.",
    "report.methodologyComparisons": "**Comparisons:** Real-world equivalents are calculated using standard emission factors for common activities and devices.",
    "report.generatedOn": "Report ID: {{id}} • Generated on {{date}}",
    "report.backToCalculator": "Back to Calculator",
    
    // Info cards
    "info.instantCalc": "Instant Calculation",
    "info.instantCalcDesc": "Get immediate CO₂ estimates for your prompts or token counts",
    "info.multipleModels": "Multiple Models",
    "info.multipleModelsDesc": "Support for GPT-4, Claude, Gemini and other popular AI models",
    "info.detailedReports": "Detailed Reports",
    "info.detailedReportsDesc": "Get comprehensive analysis and export data via email",
    
    // CTA
    "cta.getReport": "Get Detailed CO₂ Report via Email",
    "cta.getReportDesc": "Free detailed analysis, benchmarks and export options",
    
    // Transparency
    "transparency.title": "Transparency Note:",
    "transparency.text": "These are estimates only. Actual emissions vary based on model training, infrastructure, and usage patterns. Our calculations are based on industry research and may not reflect real-time emissions.",
    
    // Comparisons
    "comparison.pcUsage": "Desktop PC Usage",
    "comparison.carTravel": "Car Travel",
    "comparison.electricity": "Household Electricity",
    "comparison.smartphoneCharge": "Smartphone Charges",
    "comparison.ledBulb": "LED Bulb Usage",
    
    // Time formats
    "time.seconds": "{{count}} seconds",
    "time.second": "{{count}} second",
    "time.minutes": "{{count}} minutes",
    "time.minute": "{{count}} minute",
    "time.hours": "{{count}} hours",
    "time.hour": "{{count}} hour",
    "time.days": "{{count}} days",
    "time.day": "{{count}} day",
    
    // Units
    "unit.meters": "meters",
    "unit.km": "km",
    "unit.charges": "charges",
    "unit.charge": "charge",
    "unit.percent": "% of 1 {{unit}}",
    
    // Equivalents
    "equivalent.pcUsage": "Equivalent to {{time}} desktop PC usage",
    "equivalent.carTravel": "Equivalent to {{distance}} gasoline car travel",
    "equivalent.smartphoneCharge": "Equivalent to {{percent}}% smartphone charge",
    "equivalent.smartphoneCharges": "Equivalent to {{count}} full smartphone charges",
    "equivalent.ledBulb": "Equivalent to {{time}} LED bulb usage",
    "equivalent.electricity": "Equivalent to {{time}} household electricity",
    
    // Errors
    "error.required": "This field is required",
    "error.invalidEmail": "Please enter a valid email address",
    "error.calculation": "Calculation failed. Please try again.",
    "error.invalidModel": "Please select a valid AI model",
    
    // Common
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.close": "Close",
    "common.back": "Back",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",

    // Email content
    "email.subject": "Your CO₂ Report – {{model}}",
    "email.summary": "Summary",
    "email.estimatedEmissions": "Estimated CO₂ emissions: {{grams}} g CO₂",
    "email.modelTokens": "Model: {{model}}, Tokens: {{tokens}}",
    "email.comparisons": "Real-world Comparisons",
    "email.optimization": "CO₂ Optimization",
    "email.quickWins": "Quick Wins (immediate)",
    "email.midTerm": "Mid-term (Process & Setup)",
    "email.advanced": "Advanced (Power Users)",
    "email.modelGuide": "Model Efficiency Guide",
    "email.privacyNote": "You are receiving this email because you consented to receiving a CO₂ report.",
    "email.copyright": "© Institute for AI",

    // Comparison labels for email
    "email.comparison.pc": "Desktop PC",
    "email.comparison.car": "Car travel (gasoline)",
    "email.comparison.household": "Household electricity",
    "email.comparison.phone": "Smartphone",
    "email.comparison.led": "LED bulb (10W)",
    "email.comparison.pcUnit": "minutes",
    "email.comparison.carUnit": "meters",
    "email.comparison.householdUnit": "minutes",
    "email.comparison.phoneUnit": "charges",
    "email.comparison.ledUnit": "hours"
  }
} as const;

// Global language state
let currentLanguage: Language = 'de';

// Initialize language from localStorage or default to German
export function initializeLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('lang') as Language;
    if (stored && (stored === 'de' || stored === 'en')) {
      currentLanguage = stored;
    }
  }
  return currentLanguage;
}

// Get current language
export function getCurrentLanguage(): Language {
  return currentLanguage;
}

// Set language and persist to localStorage
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('lang', lang);
  }
}

// Translation helper with fallback to English
export function t(key: keyof typeof translations['de'], vars?: Record<string, string | number>): string {
  const lang = getCurrentLanguage();
  let text = translations[lang]?.[key] || translations.en[key] || String(key);
  
  // Replace variables
  if (vars) {
    Object.entries(vars).forEach(([varKey, value]) => {
      text = text.replace(new RegExp(`{{${varKey}}}`, 'g'), String(value));
    });
  }
  
  return text;
}

// Number formatting utility with locale support
export function formatNumber(num: number, decimals: number = 1, lang?: Language): string {
  const locale = (lang || getCurrentLanguage()) === 'de' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

// Date formatting with locale support
export function formatDate(date: string | Date, lang?: Language): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const locale = (lang || getCurrentLanguage()) === 'de' ? 'de-DE' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

export function formatDateShort(date: string | Date, lang?: Language): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const locale = (lang || getCurrentLanguage()) === 'de' ? 'de-DE' : 'en-US';
  return new Intl.DateTimeFormat(locale).format(d);
}

// Debug helper for missing keys (only in development)
export function getMissingKeys(usedKeys: string[]): string[] {
  if (process.env.NODE_ENV !== 'development') return [];
  
  const lang = getCurrentLanguage();
  const availableKeys = Object.keys(translations[lang]);
  return usedKeys.filter(key => !availableKeys.includes(key as keyof typeof translations['de']));
}

// Legacy compatibility - keep existing exports
export const dict = { de: translations.de, en: translations.en };
export const nf1 = { format: (n: number) => formatNumber(n, 1) };
export const nf0 = { format: (n: number) => formatNumber(n, 0) };
export const fmtGrams = (g: number) => `${formatNumber(g, 1)} g CO₂`;
export const fmtTokens = (t: number) => formatNumber(t, 0);
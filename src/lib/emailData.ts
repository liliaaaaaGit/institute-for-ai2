import { EmailReportInput } from '../types/email';
import { buildComparisons } from './comparisons';
import { nf1 } from './intl';

// Model efficiency data for the email report
export const modelEfficiencyData = [
  { name: 'Mistral 7B', gPer1k: '0,5', bestFor: 'Einfache Texte, Zusammenfassungen' },
  { name: 'Claude Haiku', gPer1k: '1,0', bestFor: 'Schnelle Antworten, Chat' },
  { name: 'GPT-3.5', gPer1k: '1,0', bestFor: 'Allgemeine Aufgaben, Prototyping' },
  { name: 'Gemini 1.5 Pro', gPer1k: '2,5', bestFor: 'Lange Kontexte, Recherche' },
  { name: 'GPT-4o', gPer1k: '3,0', bestFor: 'Komplexe Analysen, Multimodal' },
  { name: 'Claude Sonnet', gPer1k: '3,0', bestFor: 'Kreatives Schreiben, Code' },
  { name: 'Mistral Large', gPer1k: '4,0', bestFor: 'Komplexe Aufgaben, Reasoning' },
  { name: 'GPT-4', gPer1k: '5,0', bestFor: 'Höchste Qualität, kritische Aufgaben' }
];

export function createEmailReportData(
  to: string,
  sessionData: {
    sessionId: string;
    co2Grams: number;
    tokens: number;
    modelName: string;
    provider: string;
    originalPrompt?: string;
    timestamp: string;
  }
): EmailReportInput {
  const comparisons = buildComparisons(sessionData.co2Grams);
  
  // Find a lighter model suggestion
  const currentModelData = modelEfficiencyData.find(m => 
    m.name.toLowerCase().includes(sessionData.modelName.toLowerCase())
  );
  
  const altModelSuggestion = currentModelData 
    ? modelEfficiencyData.find(m => 
        parseFloat(m.gPer1k.replace(',', '.')) < parseFloat(currentModelData.gPer1k.replace(',', '.'))
      )
    : modelEfficiencyData[0]; // Default to most efficient

  return {
    to,
    sessionId: sessionData.sessionId,
    sessionDateISO: sessionData.timestamp,
    co2Grams: sessionData.co2Grams,
    tokens: sessionData.tokens,
    modelName: sessionData.modelName,
    provider: sessionData.provider,
    promptExcerpt: sessionData.originalPrompt 
      ? sessionData.originalPrompt.substring(0, 200) + (sessionData.originalPrompt.length > 200 ? '...' : '')
      : 'Direkte Token-Eingabe',
    comparisons: {
      pc: comparisons.find(c => c.key === 'pc')?.value || '',
      car: comparisons.find(c => c.key === 'car')?.value || '',
      household: comparisons.find(c => c.key === 'household')?.value || '',
      phone: comparisons.find(c => c.key === 'phone')?.value || '',
      led: comparisons.find(c => c.key === 'led')?.value || ''
    },
    modelEfficiencyRows: modelEfficiencyData,
    altModelSuggestion,
    methodologyVersionDate: 'September 2025',
    links: {
      session: `${import.meta.env.VITE_APP_URL || 'https://co-footprint-calcula-xwj8.bolt.host'}/report/${sessionData.sessionId}`,
      compare: import.meta.env.VITE_APP_URL || 'https://co-footprint-calcula-xwj8.bolt.host',
      unsubscribe: `${import.meta.env.VITE_APP_URL || 'https://co-footprint-calcula-xwj8.bolt.host'}/unsubscribe`,
      privacy: `${import.meta.env.VITE_APP_URL || 'https://co-footprint-calcula-xwj8.bolt.host'}/privacy`
    }
  };
}
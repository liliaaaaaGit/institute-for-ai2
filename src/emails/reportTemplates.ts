// src/emails/reportTemplates.ts
// Kleine Hilfsmodule, die du im App-Code nutzen kannst.

import type { Comparison } from './Co2Report.html'

export function defaultComparisonsFromGrams(grams: number): Comparison[] {
  // Beispielwerte – nimm hier deine echten Umrechnungen
  return [
    { label: 'Desktop-PC', value: `${toHours(grams, 60)} Stunden` },
    { label: 'Autofahrt (Benzin)', value: `${toKm(grams, 150)} Kilometer` },
    { label: 'Haushaltsstrom', value: `${toHours(grams, 120)} Stunden` },
    { label: 'Smartphone', value: `${toCharges(grams, 2.4)} Aufladungen` },
    { label: 'LED-Lampe (10 W)', value: `${toDays(grams, 8)} Tage` },
  ]
}

export function buildSubject(model: string, grams: number) {
  return `Ihr CO₂-Bericht – ${model} (${formatDE(grams)}g)`
}

// Helpers (Dummy-Umrechnungen → bitte bei Bedarf fachlich anpassen)
const formatDE = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 1 })
const toHours = (g: number, factor: number) => formatDE(g / factor)
const toKm = (g: number, factor: number) => formatDE(g / factor)
const toDays = (g: number, factor: number) => formatDE(g / factor)
const toCharges = (g: number, factor: number) => formatDE(g / factor)

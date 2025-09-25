export const nf1 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
export const nf0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

export const fmtGrams = (g: number) => `${nf1.format(g)} g CO₂`;
export const fmtTokens = (t: number) => nf0.format(t);
import { t, formatNumber } from './i18n';

export type Comparison = {
  key: string;
  label: string;        // short label ("Desktop-PC", "Autofahrt", …)
  value: string;        // formatted value ("5 Minuten", "61 Meter", …)
  detail?: string;      // optional secondary line
};

export const factors = {
  grid_g_per_kwh: 400,
  pc_watts: 150,                  // 0.15 kW
  car_g_per_km: 150,
  household_kwh_per_h: 0.4,
  phone_kwh_per_charge: 0.006,    // 6 Wh
  led_kwh_per_h: 0.01
} as const;

export function buildComparisons(co2: number): Comparison[] {
  // Clamp to avoid negative/NaN values
  co2 = Math.max(co2, 0);
  
  const pc_g_per_h = (factors.pc_watts / 1000) * factors.grid_g_per_kwh;          // 60
  const household_g_per_h = factors.household_kwh_per_h * factors.grid_g_per_kwh; // 160
  const phone_g_per_charge = factors.phone_kwh_per_charge * factors.grid_g_per_kwh; // 2.4
  const led_g_per_h = factors.led_kwh_per_h * factors.grid_g_per_kwh;             // 4

  // 1) Desktop PC
  const pcHours = co2 / pc_g_per_h;
  const pcValue =
    pcHours < 3 ? `${Math.round(pcHours * 60)} ${pcHours * 60 === 1 ? 'Minute' : 'Minuten'}` : `${formatNumber(pcHours)} ${pcHours === 1 ? 'Stunde' : 'Stunden'}`;

  // 2) Gasoline car
  const carKm = co2 / factors.car_g_per_km;
  const carValue =
    carKm < 1 ? `${formatNumber(carKm * 1000)} Meter` : `${formatNumber(carKm)} km`;

  // 3) Household electricity
  const hhHours = co2 / household_g_per_h;
  const hhValue =
    hhHours < 2 ? `${Math.round(hhHours * 60)} ${hhHours * 60 === 1 ? 'Minute' : 'Minuten'}` : `${formatNumber(hhHours)} ${hhHours === 1 ? 'Stunde' : 'Stunden'}`;

  // 4) Smartphone charges
  const charges = co2 / phone_g_per_charge;
  const chargesValue = `${Math.round(charges)} ${Math.round(charges) === 1 ? 'Aufladung' : 'Aufladungen'}`;

  // 5) LED bulb (10 W)
  const ledHours = co2 / led_g_per_h;
  const ledDays = ledHours / 24;
  const ledValue =
    ledHours < 24 ? `${formatNumber(ledHours)} ${ledHours === 1 ? 'Stunde' : 'Stunden'}` : `${formatNumber(ledDays)} ${ledDays === 1 ? 'Tag' : 'Tage'}`;

  return [
    { key: 'pc', label: t('comparison.pcUsage'), value: pcValue },
    { key: 'car', label: t('comparison.carTravel'), value: carValue },
    { key: 'household', label: t('comparison.electricity'), value: hhValue },
    { key: 'phone', label: t('comparison.smartphoneCharge'), value: chargesValue },
    { key: 'led', label: t('comparison.ledBulb'), value: ledValue }
  ];
}

// Tooltip text for assumptions
export const assumptionsText = t('transparency.text');
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

const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });

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
    pcHours < 3 ? `${nf.format(pcHours * 60)} Minuten` : `${nf.format(pcHours)} Stunden`;

  // 2) Gasoline car
  const carKm = co2 / factors.car_g_per_km;
  const carValue =
    carKm < 1 ? `${nf.format(carKm * 1000)} Meter` : `${nf.format(carKm)} Kilometer`;

  // 3) Household electricity
  const hhHours = co2 / household_g_per_h;
  const hhValue =
    hhHours < 2 ? `${nf.format(hhHours * 60)} Minuten` : `${nf.format(hhHours)} Stunden`;

  // 4) Smartphone charges
  const charges = co2 / phone_g_per_charge;
  const chargesValue = `${nf.format(charges)} Aufladungen`;

  // 5) LED bulb (10 W)
  const ledHours = co2 / led_g_per_h;
  const ledDays = ledHours / 24;
  const ledValue =
    ledHours < 24 ? `${nf.format(ledHours)} Stunden` : `${nf.format(ledDays)} Tage`;

  return [
    { key: 'pc', label: 'Desktop-PC', value: pcValue },
    { key: 'car', label: 'Autofahrt (Benzin)', value: carValue },
    { key: 'household', label: 'Haushaltsstrom', value: hhValue },
    { key: 'phone', label: 'Smartphone', value: chargesValue, detail: 'volle Aufladungen' },
    { key: 'led', label: 'LED-Lampe (10 W)', value: ledValue }
  ];
}

// Tooltip text for assumptions
export const assumptionsText = "Annahmen: 400 g CO₂/kWh; Desktop 150 W; Auto 150 g/km; Haushalt 0,4 kWh/h; LED 10 W; Smartphone 6 Wh.";
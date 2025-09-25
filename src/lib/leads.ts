export async function upsertLead(
  email: string,
  consentChecked: boolean,
  meta?: Record<string, any>
) {
  const normalized = email.trim().toLowerCase();
  try {
    const { error } = await supabase
      .from('leads')
      .upsert(
        {
          email: normalized,
          consent_marketing: consentChecked,       // MUSS true sein, sonst RLS-401
          consent_policy_version: 'v1',
          meta: meta ?? null,
        },
        { onConflict: 'email', ignoreDuplicates: true }
      ); // kein .select()
    if (error) throw error;
    return true;
  } catch (e: any) {
    // Falls doch ein plain INSERT irgendwo feuert: 23505/409 einfach als "ok" behandeln
    const msg = String(e?.message || '');
    if (e?.code === '23505' || /unique|duplicate|409/i.test(msg)) return true;
    throw e;
  }
}

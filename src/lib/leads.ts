import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/**
 * Save a lead into the Supabase "leads" table.
 * - `email`: user's email address
 * - `consentChecked`: true if the user gave marketing consent (checkbox)
 * - `meta`: optional JSON metadata (sessionId, source, etc.)
 */
export async function saveLead(
  email: string,
  consentChecked: boolean,
  meta?: Record<string, any>
) {
  const { error } = await supabase
    .from('leads')
    .insert([{
      email,
      consent_marketing: consentChecked,
      consent_policy_version: 'v1',
      meta: meta ?? null
    }]); // return=minimal
    }]); // return=minimal
+    }]); // return=minimal

  if (error) {
    if ((error as any).code === '23505') {
      throw new Error('Bereits heute registriert – bitte E-Mail prüfen.');
    }
    throw error;
  }
  return true; // success
}
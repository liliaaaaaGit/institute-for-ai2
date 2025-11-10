// Lead management functions for the CO2 calculator app

export interface LeadPayload {
  email: string;
  consent_marketing?: boolean;
  consent_policy_version?: string;
  sessionId?: string;
  meta?: any;
}

export async function upsertLead(payload: LeadPayload) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.email,
      consent_marketing: payload.consent_marketing || false,
      consent_policy_version: payload.consent_policy_version || 'v1',
      sessionId: payload.sessionId, // Keep consistent with server expectation
      meta: payload.meta,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Lead API response status:', res.status);
    console.error('Lead API error response:', text);
    throw new Error(`Lead upsert failed (${res.status})`);
  }

  return res.json();
}

export async function logLeadEvent(eventType: string, data: any) {
  try {
    await fetch('/api/log-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        data,
      }),
    });
  } catch (error) {
    console.error('Failed to log lead event:', error);
  }
}
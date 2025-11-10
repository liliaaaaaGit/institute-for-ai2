interface UpsertLeadPayload {
  email: string;
  sessionId?: string;
  consentMarketing?: boolean;
  consentPolicyVersion?: string;
  meta?: any;
}

export async function upsertLead(payload: UpsertLeadPayload): Promise<void> {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        session_id: payload.sessionId || crypto.randomUUID(),
        consent_marketing: payload.consentMarketing || false,
        consent_policy_version: payload.consentPolicyVersion || '1.0',
        meta: payload.meta || {}
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Lead API response status:', response.status);
      console.error('Lead API error response:', errorBody);
      throw new Error(`Lead upsert failed (${response.status})`);
    }

    const result = await response.json();
    console.log('Lead upserted successfully:', result);
  } catch (error) {
    console.error('Lead API error:', error);
    throw error;
  }
}

export async function logLeadEvent(eventType: string, sessionId: string, data?: any): Promise<void> {
  try {
    const response = await fetch('/api/log-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        session_id: sessionId,
        data: data || {}
      }),
    });

    if (!response.ok) {
      console.error('Event logging failed:', response.status);
    }
  } catch (error) {
    console.error('Event logging error:', error);
  }
}
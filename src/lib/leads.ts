interface UpsertLeadPayload {
  email: string;
  sessionId?: string;
  consentMarketing?: boolean;
  consentPolicyVersion?: string;
}

export async function upsertLead(payload: UpsertLeadPayload): Promise<void> {
  const { email, sessionId, consentMarketing, consentPolicyVersion } = payload;
  
  const requestPayload = {
    email,
    sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    consent_marketing: consentMarketing || false,
    consent_policy_version: consentPolicyVersion || '1.0',
    meta: {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
  };

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lead API response status:', response.status);
      console.error('Lead API error response:', errorText);
      throw new Error(`Lead upsert failed (${response.status})`);
    }

    const result = await response.json();
    console.log('Lead upserted successfully:', result);
  } catch (error) {
    console.error('Lead API error:', error);
    throw error;
  }
}

export async function logLeadEvent(eventData: any): Promise<void> {
  try {
    const response = await fetch('/api/log-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      console.error('Event logging failed:', response.status);
    }
  } catch (error) {
    console.error('Event logging error:', error);
  }
}
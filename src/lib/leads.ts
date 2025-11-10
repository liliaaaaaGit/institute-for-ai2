export async function upsertLead(email: string, consentMarketing: boolean, meta: any) {
  try {
    const payload = {
      email,
      consentMarketing,
      sessionId: meta.sessionId || crypto.randomUUID(),
      consentPolicyVersion: '1.0'
    }

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Lead API response status:', response.status)
      console.error('Lead API error response:', errorText)
      throw new Error(`Lead upsert failed (${response.status})`)
    }

    const result = await response.json()
    console.log('Lead upserted successfully:', result)
    return result
  } catch (error) {
    console.error('Lead API error:', error)
    throw error
  }
}

export async function logLeadEvent(eventData: any) {
  try {
    const response = await fetch('/api/log-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      console.error('Event logging failed:', response.status)
      return false
    }

    return true
  } catch (error) {
    console.error('Event logging error:', error)
    return false
  }
}
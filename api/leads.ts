import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate environment variables
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      console.error('Missing environment variables:', {
        hasUrl: !!SUPABASE_URL,
        hasServiceRole: !!SERVICE_ROLE
      })
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Missing required environment variables'
      })
    }

    // Parse and validate request body
    let body
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return res.status(400).json({ error: 'Invalid JSON in request body' })
    }

    const { email, consentMarketing, sessionId, consentPolicyVersion } = body

    // Validate required fields
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' })
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' })
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .upsert({
        email: email.trim().toLowerCase(),
        consent_marketing: Boolean(consentMarketing),
        consent_policy_version: consentPolicyVersion || '1.0',
        session_id: sessionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })

    if (error) {
      console.error('Supabase leads error:', error)
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message 
      })
    }

    console.log('Lead upserted successfully:', { email, sessionId })
    return res.status(200).json({ ok: true, data })

  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    })
  }
}
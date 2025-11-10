// api/leads.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables:', {
        hasUrl: !!SUPABASE_URL,
        hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY
      });
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Missing required environment variables',
        details: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured'
      });
    }

    // Parse and validate request body
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(400).json({ 
        error: 'Invalid JSON',
        message: 'Request body must be valid JSON'
      });
    }

    const { email, consent_marketing, consent_policy_version, meta, sessionId } = body;

    // Validate required fields
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Email is required and must be a non-empty string'
      });
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Prepare lead data - only use columns that exist in the leads table
    const leadData = {
      email: email.trim().toLowerCase(),
      consent_marketing: Boolean(consent_marketing),
      consent_policy_version: consent_policy_version || '1.0',
      created_at: new Date().toISOString()
    };

    // If sessionId is provided and valid, try to find the session
    if (sessionId && typeof sessionId === 'string') {
      const { data: session } = await supabase
        .from('sessions')
        .select('id')
        .eq('public_slug', sessionId)
        .single();
      
      if (session) {
        leadData.session_id = session.id;
      }
    }

    // Upsert lead into database
    const { data, error } = await supabase
      .from('leads')
      .upsert(leadData, {
        onConflict: 'email'
      })
      .select();

    if (error) {
      console.error('Supabase leads error:', error);
      return res.status(500).json({ 
        error: 'Supabase error',
        message: error.message,
        details: error.details,
        hint: error.hint
      });
    }

    console.log('Lead upserted successfully:', { email, sessionId });
    return res.status(200).json({ ok: true, data });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    });
  }
}
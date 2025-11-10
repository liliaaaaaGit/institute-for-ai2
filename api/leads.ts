import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables - check both possible names
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Supabase URL source', {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
      SERVICE_KEY: !!SUPABASE_SERVICE_ROLE_KEY
    });
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase env vars', { 
        hasUrl: !!SUPABASE_URL, 
        hasKey: !!SUPABASE_SERVICE_ROLE_KEY 
      });
      return res.status(500).json({ error: 'Supabase env vars not set' });
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

    // Use consistent key naming - match what client sends
    const { email, consent_marketing, consent_policy_version, meta, sessionId } = body;

    // Validate required fields
    if (!email || typeof email !== 'string' || !email.trim()) {
      console.warn('Missing or invalid email:', { email });
      return res.status(400).json({ error: 'Missing or invalid email' });
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Prepare lead data - only use columns that exist in the leads table
    const leadData: any = {
      email: email.trim().toLowerCase(),
      consent_marketing: Boolean(consent_marketing),
      consent_policy_version: consent_policy_version || 'v1'
    };

    // If sessionId is provided and valid, try to find the session
    if (sessionId && typeof sessionId === 'string') {
      try {
        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .select('id')
          .eq('public_slug', sessionId)
          .single();
        
        if (sessionError) {
          console.warn('Session lookup failed:', sessionError.message);
        } else if (session) {
          leadData.session_id = session.id;
        }
      } catch (sessionLookupError) {
        console.warn('Session lookup error:', sessionLookupError);
        // Continue without session_id - it's optional
      }
    }

    // Generate confirmation token for email verification using proper crypto import
    leadData.confirmation_token = randomBytes(32).toString('hex');

    console.log('Attempting to upsert lead with data:', {
      email: leadData.email,
      has_session_id: !!leadData.session_id,
      has_token: !!leadData.confirmation_token
    });

    // Upsert lead into database
    const { data, error } = await supabase
      .from('leads')
      .upsert(leadData, {
        onConflict: 'email'
      })
      .select();

    if (error) {
      console.error('Supabase leads error', error);
      return res.status(500).json({ 
        error: 'Supabase error',
        message: error.message,
        details: (error as any).details ?? null,
        hint: (error as any).hint ?? null
      });
    }

    console.log('Lead upserted successfully:', { email: leadData.email, sessionId });
    return res.status(200).json({ ok: true, data });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}
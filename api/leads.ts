      import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const supabase = SUPABASE_URL && SERVICE_ROLE ? createClient(SUPABASE_URL, SERVICE_ROLE) : null;

export default async function handler(req, res) {
  // Add CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check if Supabase client is available
    if (!supabase) {
      console.error('Supabase client not initialized - missing environment variables');
      return res.status(500).json({ 
        error: 'Database connection not available',
        debug: {
          hasUrl: !!SUPABASE_URL,
          hasServiceRole: !!SERVICE_ROLE,
          nodeEnv: process.env.NODE_ENV,
          SUPABASE_URL: SUPABASE_URL ? 'SET' : 'MISSING',
          SERVICE_ROLE: SERVICE_ROLE ? 'SET' : 'MISSING',
          NODE_ENV: process.env.NODE_ENV,
          allEnvKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
        }
      });
    }

    try {
      await supabase.from('lead_events').insert([
        {
          email: String(email).trim().toLowerCase(),
          meta: { ...meta, event: 'report_requested', newsletter: marketing },
        },
      ]);
      console.log('Lead event logged');
    } catch (eventError) {
      console.warn('Failed to log lead event (non-critical):', eventError);
    }
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal error',
      message: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      debug: `<div>
        <pre>${error}</pre>
      </div>`
    });
  }
}
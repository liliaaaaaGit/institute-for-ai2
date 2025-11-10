      error: 'Database connection not available',
    return res.status(500).json({ 
      debug: {
    console.error('Supabase client not initialized - missing environment variables');
        hasUrl: !!SUPABASE_URL,
  if (!supabase) {
        hasServiceRole: !!SERVICE_ROLE,
  // Check if Supabase client is available
        nodeEnv: process.env.NODE_ENV
  
      }
  }
    });
    return res.status(200).end();
  }
  if (req.method === 'OPTIONS') {

  
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Add CORS headers for development
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

    SUPABASE_URL: SUPABASE_URL ? 'SET' : 'MISSING',
    SERVICE_ROLE: SERVICE_ROLE ? 'SET' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
  } catch (error) {
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
        <pre>${error}</pre>
    }
const supabase = SUPABASE_URL && SERVICE_ROLE ? createClient(SUPABASE_URL, SERVICE_ROLE) : null;
      </div>
    return res.status(500).json({ 
      error: 'Internal error',
      message: e?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    });
  }
}
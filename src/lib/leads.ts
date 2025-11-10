import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

try {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      consent_marketing: !!consentMarketing,        // ← store exactly what the user chose
      consent_policy_version: 'v1',
      meta: { ...(meta ?? {}), newsletter: !!consentMarketing }, // helpful for audits
    }),
  });
  
  if (!response.ok) {
    let j: any = {};
    try {
      j = await response.json();
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
      j = { error: `HTTP ${response.status} ${response.statusText}` };
    }
    throw new Error(j?.error || j?.message || `Lead upsert failed (${response.status})`);
  }
} catch (error) {
  if (error instanceof Error && error.message.includes('Network error')) {
    throw error;
  }
} catch (fetchError) {
  console.error('Network error during lead upsert:', fetchError);
  throw new Error(`Network error: ${fetchError}`);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    ReactDOM.createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; background: #fee; border: 1px solid #f00;">
        <h1>Render Error</h1>
        <p>Failed to render the React application.</p>
        <pre>${error}</pre>
      </div>
    \`;
  }
}
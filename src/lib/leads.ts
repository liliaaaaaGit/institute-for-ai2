import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

  } catch (error) {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        consent_marketing: !!consentMarketing,        // ← store exactly what the user chose
        consent_policy_version: 'v1',
        meta: { ...(meta ?? {}), newsletter: !!consentMarketing }, // helpful for audits
      }),
    });
  } catch (fetchError) {
    console.error('Network error during lead upsert:', fetchError);
    throw new Error(`Network error: ${fetchError}`);
  }
    console.error('Failed to render app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; background: #fee; border: 1px solid #f00;">
        <h1>Render Error</h1>
        <p>Failed to render the React application.</p>
        <pre>${error}</pre>
    let j: any = {};
    try {
      j = await r.json();
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
      j = { error: `HTTP ${r.status} ${r.statusText}` };
    }
      </div>
    throw new Error(j?.error || j?.message || `Lead upsert failed (${r.status})`)
  }
}
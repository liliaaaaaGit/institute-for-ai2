import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx loading...')
console.log('Environment variables:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE
})

// Find root element
const rootElement = document.getElementById('root')
console.log('Root element found:', !!rootElement)

if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; background: #fee; border: 1px solid #f00; margin: 20px;">
      <h1>Critical Error</h1>
      <p>Root element with id="root" not found in HTML.</p>
      <p>Check index.html file.</p>
    </div>
  `
} else {
  try {
    console.log('Creating React root...')
    const root = ReactDOM.createRoot(rootElement)
    
    console.log('Rendering App...')
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    console.log('App rendered successfully!')
  } catch (error) {
    console.error('Failed to render app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; background: #fee; border: 1px solid #f00;">
        <h1>Render Error</h1>
        <p>Failed to render the React application.</p>
        <pre>${error}</pre>
        <button onclick="window.location.reload()">Reload Page</button>
      </div>
    `
  }
}
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error boundary for better debugging
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  // Fallback rendering
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to load the application. Please check the console for details.</p>
      <pre>${error}</pre>
    </div>
  `
}
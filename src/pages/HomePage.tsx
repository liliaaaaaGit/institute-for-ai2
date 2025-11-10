import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')

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
    const root = ReactDOM.createRoot(rootElement)
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
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
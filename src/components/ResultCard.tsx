import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = `
        <p>Failed to render the React application.</p>
    `
} else {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
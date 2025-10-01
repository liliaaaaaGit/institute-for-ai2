import React from 'react'

// Minimal error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fee',
          border: '1px solid #f00',
          margin: '20px'
        }}>
          <h1>Application Error</h1>
          <p>Something went wrong. Check the browser console for details.</p>
          <details>
            <summary>Error Details</summary>
            <pre>{String(this.state.error)}</pre>
          </details>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Minimal test component
function TestApp() {
  console.log('TestApp rendering...')
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#D52100' }}>CO₂ Calculator - Debug Mode</h1>
      <p>If you can see this, React is working!</p>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Environment Check</h2>
        <ul>
          <li>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
          <li>VITE_APP_URL: {import.meta.env.VITE_APP_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>NODE_ENV: {import.meta.env.NODE_ENV}</li>
          <li>MODE: {import.meta.env.MODE}</li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Browser Info</h2>
        <ul>
          <li>User Agent: {navigator.userAgent}</li>
          <li>URL: {window.location.href}</li>
          <li>Protocol: {window.location.protocol}</li>
        </ul>
      </div>

      <button 
        onClick={() => {
          console.log('Button clicked - testing JavaScript execution')
          alert('JavaScript is working!')
        }}
        style={{
          backgroundColor: '#D52100',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Test JavaScript
      </button>
    </div>
  )
}

export default function App() {
  console.log('App component loading...')
  
  try {
    return (
      <ErrorBoundary>
        <TestApp />
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('App render error:', error)
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Critical Error</h1>
        <p>Failed to render the application.</p>
        <pre>{String(error)}</pre>
      </div>
    )
  }
}
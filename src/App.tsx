import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { initializeLanguage } from './lib/i18n'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import ThanksPage from './pages/ThanksPage'
import ConfirmPage from './pages/ConfirmPage'
import DebugPanel from './components/DebugPanel'

// Initialize language on app start
initializeLanguage();

// Error boundary component
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-card p-8 max-w-md w-full text-center">
            <div className="bg-red-100 p-3 rounded-2xl w-fit mx-auto mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Anwendungsfehler</h1>
            <p className="text-gray-600 mb-4">Ein unerwarteter Fehler ist aufgetreten.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-brand-red text-white px-4 py-2 rounded-xl hover:bg-brand-red/90 transition-colors"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  // Track used translation keys for debug panel
  const usedKeys = [
    'error.calculation', 'common.loading', 'common.error'
  ];

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report/:slug" element={<ReportPage />} />
            <Route path="/thanks" element={<ThanksPage />} />
            <Route path="/confirm/:token" element={<ConfirmPage />} />
          </Routes>
          <DebugPanel usedKeys={usedKeys} />
        </div>
      </Router>
    </ErrorBoundary>
  )
}
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import ThanksPage from './pages/ThanksPage'
import ConfirmPage from './pages/ConfirmPage'

export default function App() {
  try {
    return (
      <Router>
        <div className="min-h-screen bg-brand-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report/:slug" element={<ReportPage />} />
            <Route path="/thanks" element={<ThanksPage />} />
            <Route path="/confirm/:token" element={<ConfirmPage />} />
          </Routes>
        </div>
      </Router>
    )
  } catch (error) {
    console.error('App render error:', error)
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Application Error</h1>
        <p>Something went wrong. Please refresh the page.</p>
        <details>
          <summary>Error Details</summary>
          <pre>{String(error)}</pre>
        </details>
      </div>
    )
  }
}
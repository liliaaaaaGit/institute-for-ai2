import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

function AppWrapper() {
  React.useEffect(() => {
    async function loadModels() {
      try {
        if (!supabase) {
          console.error('Supabase client not initialized')
          return
        }

        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('is_active', true)
          .order('name')

        if (error) {
          console.error('Error loading models:', error)
          return
        }

        return (
          {loading ? (
            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500">
              Loading models...
            </div>
          ) : (
            <select
              id="model"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading || !modelId}
            >
              <option value="">Select a model...</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.vendor}) - {model.grams_per_1k_tokens}g CO₂/1k tokens
                </option>
              ))}
            </select>
          )}
        )
      } catch (error) {
        console.error('Failed to load models:', error)
      }
    }
    loadModels()
  }, [])
  
  return <App />
}

try {
  const rootElement = document.getElementById('root')
  const root = ReactDOM.createRoot(rootElement)
  root.render(<AppWrapper />)
} catch (error) {
  console.error('Failed to render app:', error)
  const rootElement = document.getElementById('root')
  if (rootElement) {
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
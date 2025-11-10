import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

function calculateEmissions() {
  try {
    // if (email) {
    //   await logLeadEvent(sessionId, email, { modelId, tokens: tokensInput, co2Grams });
    // }
    
    return {
      co2Grams,
      tokens: tokensInput,
      model: modelId,
      comparisons,
      inputMode,
      originalPrompt: prompt
    };
  } catch (error) {
    console.error('Error calculating emissions:', error);
    throw error;
  }
}
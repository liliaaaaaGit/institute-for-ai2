'use client'

import { useState, useEffect } from 'react'
import { Calculator, Brain, Mail, BarChart3, Monitor, Car, Lightbulb, Smartphone, Home } from 'lucide-react'
import CalculatorForm from '../components/CalculatorForm'
import ResultCard from '../components/ResultCard'
import LeadModal from '../components/LeadModal'
import { AIModel, ComparisonFactor } from '../types'
import { buildComparisons } from '../lib/comparisons'
import { supabase } from '../lib/supabaseClient'
import { h1, h2, body, bodyLarge, container, section, card } from '../components/Ui'
import { t, formatNumber } from '../i18n'

interface CalculationResult {
  sessionId: string
  publicSlug: string
  co2Grams: number
  tokens: number
  model: AIModel
}

export default function HomePage() {
  const [models, setModels] = useState<AIModel[]>([])
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    try {
      // Check if Supabase client is available
      if (!supabase) {
        console.warn('Supabase not configured, using mock data')
        setModels([
          { id: '1', name: 'GPT-4', vendor: 'OpenAI', grams_per_1k_tokens: 12.0, is_active: true },
          { id: '2', name: 'GPT-4o', vendor: 'OpenAI', grams_per_1k_tokens: 10.0, is_active: true },
          { id: '3', name: 'GPT-3.5', vendor: 'OpenAI', grams_per_1k_tokens: 7.0, is_active: true },
          { id: '4', name: 'Claude Sonnet', vendor: 'Anthropic', grams_per_1k_tokens: 11.0, is_active: true },
          { id: '5', name: 'Claude Haiku', vendor: 'Anthropic', grams_per_1k_tokens: 5.0, is_active: true },
          { id: '6', name: 'Gemini 1.5 Pro', vendor: 'Google', grams_per_1k_tokens: 10.0, is_active: true },
          { id: '7', name: 'Mistral 7B', vendor: 'Mistral AI', grams_per_1k_tokens: 4.0, is_active: true }
        ])
        return
      }
      
      const modelsRes = await supabase.from('models').select('*').eq('is_active', true)
      
      console.log('Models loaded:', modelsRes.data)
      
      if (modelsRes.data) setModels(modelsRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback to mock data on error
      setModels([
        { id: '1', name: 'GPT-4', vendor: 'OpenAI', grams_per_1k_tokens: 12.0, is_active: true },
        { id: '2', name: 'GPT-4o', vendor: 'OpenAI', grams_per_1k_tokens: 10.0, is_active: true },
        { id: '3', name: 'GPT-3.5', vendor: 'OpenAI', grams_per_1k_tokens: 7.0, is_active: true },
        { id: '4', name: 'Claude Sonnet', vendor: 'Anthropic', grams_per_1k_tokens: 11.0, is_active: true },
        { id: '5', name: 'Claude Haiku', vendor: 'Anthropic', grams_per_1k_tokens: 5.0, is_active: true },
        { id: '6', name: 'Gemini 1.5 Pro', vendor: 'Google', grams_per_1k_tokens: 10.0, is_active: true },
        { id: '7', name: 'Mistral 7B', vendor: 'Mistral AI', grams_per_1k_tokens: 4.0, is_active: true }
      ])
    }
  }

  async function handleCalculation(data: {
    inputMode: 'prompt' | 'tokens'
    prompt?: string
    tokens?: number
    modelId: string
  }) {
    setIsLoading(true)
    
    try {
      const model = models.find(m => m.id === data.modelId)
      if (!model) {
        console.error('Model not found')
        alert('Please select a valid AI model')
        return
      }

      const tokensEst = data.inputMode === 'tokens' 
        ? Number(data.tokens) 
        : Math.ceil((data.prompt ?? '').length / 4)
      
      const gramsPerToken = model.grams_per_1k_tokens / 1000
      const co2 = parseFloat((tokensEst * gramsPerToken).toFixed(1))

      // Generate a simple session ID
      const sessionId = `calc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      console.log('Generated session ID:', sessionId)

      // Get comparisons using new logic
      const comparisons = buildComparisons(co2)

      const result: CalculationResult = {
        sessionId,
        publicSlug: sessionId,
        co2Grams: co2,
        tokens: tokensEst,
        model
      }

      // Store report data in localStorage with detailed logging
      const reportData = {
        ...result,
        comparisons,
        timestamp: new Date().toISOString(),
        inputMode: data.inputMode,
        originalPrompt: data.inputMode === 'prompt' ? data.prompt : undefined,
        calculationDetails: {
          emissionFactor: model.grams_per_1k_tokens,
          tokenEstimationMethod: data.inputMode === 'prompt' ? 'Estimated from text length (~4 chars per token)' : 'User provided',
          calculationFormula: `${tokensEst} tokens × ${gramsPerToken.toFixed(4)}g CO₂/token = ${co2}g CO₂`
        }
      }
      
      const storageKey = `report_${sessionId}`
      console.log('Storing data with key:', storageKey)
      console.log('Data to store:', reportData)
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(reportData))
        console.log('Data stored successfully')
        
        // Verify storage
        const storedData = localStorage.getItem(storageKey)
        console.log('Verification - stored data exists:', !!storedData)
        if (storedData) {
          console.log('Verification - can parse stored data:', !!JSON.parse(storedData))
        }
      } catch (error) {
        console.error('Error storing data:', error)
      }
      
      setResult(result)
    } catch (error) {
      console.error('Error:', error)
      alert(t('error.calculation'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-brand-white shadow-red-sm border-b border-brand-red/10">
        <div className="mx-auto max-w-7xl px-2 md:px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="font-heading text-brand-red font-bold tracking-wide text-xs md:text-base">
              INSTITUTE FOR ARTIFICIAL INTELLIGENCE
            </div>
            <div className="flex items-center ml-4 md:ml-0">
              <img 
                src="/Key Visual copy.jpg" 
                alt="AI Logo" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${container} ${section}`}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`${h2} mb-4`}>
            {t('app.title')}
          </h1>
          <p className={`${bodyLarge} max-w-2xl mx-auto`}>
            {t('app.subtitle')}
          </p>
        </div>

        {/* Calculator Section */}
        <div className="mb-12">
          <div className={`${card}`}>
            <div className="flex items-center mb-6">
              <Calculator className="h-6 w-6 mr-3" stroke="#D52100" strokeWidth="2.5" />
              <h2 className={h2}>Emissionen berechnen</h2>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <CalculatorForm
                models={models}
                onCalculate={handleCalculation}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mb-12">
            <div className={`${card}`}>
              <ResultCard 
                result={result}
                onGetReport={() => setShowLeadModal(true)}
              />
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className={`${card} text-center`}>
            <div className="p-3 rounded-2xl bg-brand-red/5 w-fit mx-auto mb-4">
              <Calculator className="h-6 w-6" stroke="#D52100" strokeWidth="2.5" />
            </div>
            <h3 className="font-heading font-semibold text-brand-ink mb-2">{t('info.instantCalc')}</h3>
            <p className={`${body} text-sm`}>
              {t('info.instantCalcDesc')}
            </p>
          </div>
          
          <div className={`${card} text-center`}>
            <div className="p-3 rounded-2xl bg-brand-red/5 w-fit mx-auto mb-4">
              <Brain className="h-6 w-6" stroke="#D52100" strokeWidth="2.5" />
            </div>
            <h3 className="font-heading font-semibold text-brand-ink mb-2">{t('info.multipleModels')}</h3>
            <p className={`${body} text-sm`}>
              {t('info.multipleModelsDesc')}
            </p>
          </div>
          
          <div className={`${card} text-center`}>
            <div className="p-3 rounded-2xl bg-brand-red/5 w-fit mx-auto mb-4">
              <BarChart3 className="h-6 w-6" stroke="#D52100" strokeWidth="2.5" />
            </div>
            <h3 className="font-heading font-semibold text-brand-ink mb-2">{t('info.detailedReports')}</h3>
            <p className={`${body} text-sm`}>
              {t('info.detailedReportsDesc')}
            </p>
          </div>
        </div>

        {/* Transparency Note */}
        <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-4 text-center">
          <p className={`${body} text-brand-ink text-sm`}>
            <strong>{t('transparency.title')}</strong> {t('transparency.text')}
          </p>
        </div>

        {/* Lead Modal */}
        {showLeadModal && result && (
          <LeadModal 
            sessionId={result.sessionId}
            onClose={() => setShowLeadModal(false)}
          />
        )}
      </div>
    </>
  )
}
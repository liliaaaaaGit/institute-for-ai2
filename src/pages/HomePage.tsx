import React, { useState, useEffect } from 'react'
import { Calculator, Zap, BarChart3, Mail } from 'lucide-react'
import CalculatorForm from '../components/CalculatorForm'
import ResultCard from '../components/ResultCard'
import LeadModal from '../components/LeadModal'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { buildComparisons } from '../lib/comparisons'
import { upsertLead, logLeadEvent } from '../lib/leads'
import { supabase } from '../lib/supabase'
import { h1, h2, body, container, section, card, buttonPrimary } from '../components/Ui'
import { t, getCurrentLanguage, setLanguage } from '../lib/i18n'

interface CalculationResult {
  sessionId: string
  publicSlug: string
  co2Grams: number
  tokens: number
  model: {
    id: string
    name: string
    vendor: string
    grams_per_1k_tokens: number
    is_active: boolean
  }
  comparisons: any[]
  inputMode: 'prompt' | 'tokens'
  originalPrompt?: string
  timestamp: string
}

export default function HomePage() {
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [hasReportAccess, setHasReportAccess] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<any>(null)
  const [language, setCurrentLanguage] = useState(getCurrentLanguage())

  const handleLanguageChange = (newLang: any) => {
    setCurrentLanguage(newLang)
    // Force re-render of the entire page
    window.location.reload()
  }

  const handleMainButtonClick = (formData: any) => {
    // Store form data for later calculation
    setPendingFormData(formData)
    // Open email modal first
    setIsLeadModalOpen(true)
  }

  const handleCalculation = async (formData: any) => {
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      // Get models for calculation
      const { data: models, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .eq('is_active', true)

      if (modelsError) {
        throw new Error(`Failed to load models: ${modelsError.message}`)
      }

      if (!models || models.length === 0) {
        throw new Error('No active models found')
      }

      // Find the selected model
      const selectedModel = models.find(m => m.id === formData.modelId)
      if (!selectedModel) {
        throw new Error('Selected model not found')
      }

      // Calculate tokens
      let tokens = 0
      if (formData.inputMode === 'prompt') {
        tokens = Math.ceil(formData.prompt.length / 4) // Rough estimation
      } else {
        tokens = parseInt(formData.tokens) || 0
      }

      // Calculate CO2
      const co2Grams = (tokens / 1000) * selectedModel.grams_per_1k_tokens

      // Create session
      const sessionSlug = `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Build comparisons
      const comparisons = buildComparisons(co2Grams)

      // Create result object
      const calculationResult: CalculationResult = {
        sessionId: sessionSlug,
        publicSlug: sessionSlug,
        co2Grams,
        tokens,
        model: selectedModel,
        comparisons,
        inputMode: formData.inputMode,
        originalPrompt: formData.inputMode === 'prompt' ? formData.prompt : undefined,
        timestamp: new Date().toISOString()
      }

      // Store in localStorage for report page
      localStorage.setItem(`report_${sessionSlug}`, JSON.stringify(calculationResult))

      setResult(calculationResult)
    } catch (error) {
      console.error('Calculation failed:', error)
      alert(t('error.calculation'))
    }
  }

  const handleReportConfirmed = async () => {
    if (pendingFormData) {
      // Run the calculation with the stored form data
      await handleCalculation(pendingFormData)
      // Grant access to view results
      setHasReportAccess(true)
      // Close modal
      setIsLeadModalOpen(false)
      // Clear pending data
      setPendingFormData(null)
    }
  }

  const handleLeadModalClose = () => {
    setIsLeadModalOpen(false)
    setPendingFormData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-white border-b border-brand-ink/10">
        <div className={`${container} py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-brand-red/10 p-2 rounded-xl">
                <Calculator className="h-6 w-6" stroke="#D52100" strokeWidth="2.5" />
              </div>
              <div>
                <h1 className="font-heading font-semibold text-brand-ink">CO₂ Calculator</h1>
                <p className="text-sm text-brand-ink/60">Institute for AI</p>
              </div>
            </div>
            <LanguageSwitcher onLanguageChange={handleLanguageChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className={`${container} ${section}`}>
          <div className="text-center mb-12">
            <h1 className={`${h1} mb-4`}>
              {t('app.title')}
            </h1>
            <p className={`${body} text-xl max-w-2xl mx-auto`}>
              {t('app.subtitle')}
            </p>
          </div>

          {/* Calculator Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <CalculatorForm onSubmit={handleMainButtonClick} />
          </div>

          {/* Results */}
          {result && hasReportAccess && (
            <div className="max-w-4xl mx-auto">
              <ResultCard result={result} />
            </div>
          )}
        </section>

        {/* Info Cards */}
        <section className={`${container} ${section} bg-brand-white/50`}>
          <div className="grid md:grid-cols-3 gap-6">
            <div className={card}>
              <div className="flex items-center mb-4">
                <div className="bg-brand-red/10 p-2 rounded-xl mr-3">
                  <Zap className="h-5 w-5" stroke="#D52100" strokeWidth="2.5" />
                </div>
                <h3 className={`font-heading font-semibold text-brand-ink`}>{t('info.instantCalc')}</h3>
              </div>
              <p className={`text-brand-ink/80`}>{t('info.instantCalcDesc')}</p>
            </div>

            <div className={card}>
              <div className="flex items-center mb-4">
                <div className="bg-brand-red/10 p-2 rounded-xl mr-3">
                  <BarChart3 className="h-5 w-5" stroke="#D52100" strokeWidth="2.5" />
                </div>
                <h3 className={`font-heading font-semibold text-brand-ink`}>{t('info.multipleModels')}</h3>
              </div>
              <p className={`text-brand-ink/80`}>{t('info.multipleModelsDesc')}</p>
            </div>

            <div className={card}>
              <div className="flex items-center mb-4">
                <div className="bg-brand-red/10 p-2 rounded-xl mr-3">
                  <Mail className="h-5 w-5" stroke="#D52100" strokeWidth="2.5" />
                </div>
                <h3 className={`font-heading font-semibold text-brand-ink`}>{t('info.detailedReports')}</h3>
              </div>
              <p className={`text-brand-ink/80`}>{t('info.detailedReportsDesc')}</p>
            </div>
          </div>
        </section>

        {/* Transparency Note */}
        <section className={`${container} pb-8`}>
          <div className="bg-brand-ink/5 border border-brand-ink/10 rounded-2xl p-6 max-w-4xl mx-auto">
            <p className={`text-sm text-brand-ink/80`}>
              <strong>{t('transparency.title')}</strong> {t('transparency.text')}
            </p>
          </div>
        </section>
      </main>

      {/* Lead Modal */}
      {isLeadModalOpen && (
        <LeadModal
          isOpen={isLeadModalOpen}
          onClose={handleLeadModalClose}
          sessionId="pending"
          onReportConfirmed={handleReportConfirmed}
        />
      )}
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import { Calculator } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { t } from '../lib/i18n'

interface Model {
  id: string
  name: string
  vendor: string
  grams_per_1k_tokens: number
  is_active: boolean
}

interface CalculatorFormProps {
  onSubmit: (formData: {
    inputMode: 'prompt' | 'tokens'
    prompt?: string
    tokens?: string
    modelId: string
  }) => void
}

export default function CalculatorForm({ onSubmit }: CalculatorFormProps) {
  const [inputMode, setInputMode] = useState<'prompt' | 'tokens'>('prompt')
  const [prompt, setPrompt] = useState('')
  const [tokens, setTokens] = useState('')
  const [modelId, setModelId] = useState('')
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadModels() {
      try {
        if (!supabase) {
          console.error('Supabase client not initialized')
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('is_active', true)
          .order('name')

        if (error) {
          console.error('Error loading models:', error)
          setLoading(false)
          return
        }

        if (data && data.length > 0) {
          setModels(data)
          setModelId(data[0].id) // Set first model as default
        }
        setLoading(false)
      } catch (error) {
        console.error('Failed to load models:', error)
        setLoading(false)
      }
    }
    loadModels()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!modelId) {
      alert('Please select a model')
      return
    }

    if (inputMode === 'prompt' && !prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

    if (inputMode === 'tokens' && (!tokens || parseInt(tokens) <= 0)) {
      alert('Please enter a valid number of tokens')
      return
    }

    onSubmit({
      inputMode,
      prompt: inputMode === 'prompt' ? prompt : undefined,
      tokens: inputMode === 'tokens' ? tokens : undefined,
      modelId
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand-red/10 p-2 rounded-xl">
          <Calculator className="h-5 w-5" stroke="#D52100" strokeWidth="2.5" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-brand-ink">
          {t('calculator.title')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Mode Toggle */}
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-3">
            {t('calculator.inputMode')}
          </label>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setInputMode('prompt')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === 'prompt'
                  ? 'bg-white text-brand-ink shadow-sm'
                  : 'text-brand-ink/60 hover:text-brand-ink'
              }`}
            >
              {t('calculator.byPrompt')}
            </button>
            <button
              type="button"
              onClick={() => setInputMode('tokens')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === 'tokens'
                  ? 'bg-white text-brand-ink shadow-sm'
                  : 'text-brand-ink/60 hover:text-brand-ink'
              }`}
            >
              {t('calculator.byTokens')}
            </button>
          </div>
        </div>

        {/* Input Field */}
        {inputMode === 'prompt' ? (
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-brand-ink mb-2">
              {t('calculator.prompt')}
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('calculator.promptPlaceholder')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="tokens" className="block text-sm font-medium text-brand-ink mb-2">
              {t('calculator.tokens')}
            </label>
            <input
              type="number"
              id="tokens"
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              required
            />
          </div>
        )}

        {/* Model Selection */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-brand-ink mb-2">
            {t('calculator.model')}
          </label>
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
              disabled={loading || models.length === 0}
            >
              <option value="">Select a model...</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.vendor}) - {model.grams_per_1k_tokens}g CO₂/1k tokens
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || models.length === 0}
          className="w-full bg-brand-red text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('calculator.calculate')}
        </button>
      </form>
    </div>
  )
}
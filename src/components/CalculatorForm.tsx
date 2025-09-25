'use client'

import { useState, useEffect } from 'react'
import { HelpCircle, Zap } from 'lucide-react'
import { AIModel } from '@/types'
import { body, buttonPrimary } from './Ui'
import { t } from '../i18n'

interface Props {
  models: AIModel[]
  onCalculate: (data: any) => void
  isLoading: boolean
}

export default function CalculatorForm({ models, onCalculate, isLoading }: Props) {
  const [inputMode, setInputMode] = useState<'prompt' | 'tokens'>('prompt')
  const [prompt, setPrompt] = useState('')
  const [tokens, setTokens] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [showTokenInfo, setShowTokenInfo] = useState(false)

  // Set the first model as default when models are loaded
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].id)
    }
  }, [models, selectedModel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Double-check that the selected model exists in the current models array
    const modelExists = models.find(model => model.id === selectedModel)
    if (!selectedModel || !modelExists) {
      console.error('Invalid model selected:', selectedModel)
      return
    }
    
    const data = {
      inputMode,
      modelId: selectedModel,
      ...(inputMode === 'prompt' ? { prompt } : { tokens: parseInt(tokens) })
    }
    
    onCalculate(data)
  }

  const isValid = selectedModel && models.find(model => model.id === selectedModel) && (
    (inputMode === 'prompt' && prompt.trim()) ||
    (inputMode === 'tokens' && tokens && parseInt(tokens) > 0)
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Input Mode Toggle */}
      <div>
        <label className={`block text-sm font-medium text-brand-ink mb-3`}>
          {t('form.inputMethod')}
        </label>
        <div className="flex bg-brand-ink/5 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setInputMode('prompt')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'prompt'
                ? 'bg-brand-white text-brand-red shadow-sm'
                : 'text-brand-ink/60 hover:text-brand-ink'
            }`}
          >
            {t('form.pastePrompt')}
          </button>
          <button
            type="button"
            onClick={() => setInputMode('tokens')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'tokens'
                ? 'bg-brand-white text-brand-red shadow-sm'
                : 'text-brand-ink/60 hover:text-brand-ink'
            }`}
          >
            {t('form.enterTokens')}
          </button>
        </div>
      </div>

      {/* Input Field */}
      <div>
        {inputMode === 'prompt' ? (
          <div>
            <label className={`block text-sm font-medium text-brand-ink mb-2`}>
              {t('form.aiPrompt')}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('form.placeholderPrompt')}
              className="input-field h-32 resize-none"
              required
            />
            {prompt && (
              <p className={`text-xs text-brand-ink/60 mt-1`}>
                {t('form.tokensEstimated', { count: Math.ceil(prompt.length / 4) })}
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-2">
              <label className={`block text-sm font-medium text-brand-ink`}>
                {t('form.tokenCount')}
              </label>
              <button
                type="button"
                onClick={() => setShowTokenInfo(!showTokenInfo)}
                className="ml-2 text-brand-ink/40 hover:text-brand-ink/60"
              >
                <HelpCircle className="h-4 w-4" stroke="#D52100" strokeWidth="2" />
              </button>
            </div>
            
            {showTokenInfo && (
              <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl p-3 mb-3 text-sm text-brand-ink">
                <p className="font-medium mb-1 text-brand-ink">{t('tokens.whatAre')}</p>
                <p>{t('tokens.explanation')}</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>{t('tokens.ratio1')}</li>
                  <li>{t('tokens.ratio2')}</li>
                  <li>{t('tokens.ratio3')}</li>
                </ul>
              </div>
            )}
            
            <input
              type="number"
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
              placeholder={t('form.placeholderTokens')}
              className="input-field"
              min="1"
              required
            />
          </div>
        )}
      </div>

      {/* Model Selection */}
      <div>
        <label className={`block text-sm font-medium text-brand-ink mb-2`}>
          {t('form.aiModel')}
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="input-field"
          required
        >
          <option value="">{t('form.selectModel')}</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.vendor}) - {model.grams_per_1k_tokens}g CO₂/1k tokens
            </option>
          ))}
        </select>
      </div>

      {/* Calculate Button */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={`${buttonPrimary} w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
            {t('form.calculating')}
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2.5" />
            {t('form.calculate')}
          </>
        )}
      </button>
    </form>
  )
}
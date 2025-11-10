import React, { useState } from 'react'
import { Calculator, Zap } from 'lucide-react'
import { t } from '../lib/i18n'

interface CalculatorFormProps {
  onSubmit: (formData: any) => void
}

export default function CalculatorForm({ onSubmit }: CalculatorFormProps) {
  const [inputMode, setInputMode] = useState<'prompt' | 'tokens'>('prompt')
  const [prompt, setPrompt] = useState('')
  const [tokens, setTokens] = useState('')
  const [modelId, setModelId] = useState('gpt-4')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = {
      inputMode,
      prompt: inputMode === 'prompt' ? prompt : '',
      tokens: inputMode === 'tokens' ? tokens : '',
      modelId
    }
    
    onSubmit(formData)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Mode Toggle */}
        <div className="flex bg-gray-50 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setInputMode('prompt')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              inputMode === 'prompt'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="h-4 w-4 inline mr-2" />
            {t('form.promptMode')}
          </button>
          <button
            type="button"
            onClick={() => setInputMode('tokens')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              inputMode === 'tokens'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calculator className="h-4 w-4 inline mr-2" />
            {t('form.tokenMode')}
          </button>
        </div>

        {/* Input Field */}
        {inputMode === 'prompt' ? (
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.promptLabel')}
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('form.promptPlaceholder')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="tokens" className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.tokensLabel')}
            </label>
            <input
              id="tokens"
              type="number"
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
              placeholder={t('form.tokensPlaceholder')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              required
            />
          </div>
        )}

        {/* Model Selection */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.modelLabel')}
          </label>
          <select
            id="model"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Calculator className="h-5 w-5" />
          {t('cta.getReport')}
        </button>
      </form>
    </div>
  )
}
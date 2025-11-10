import React from 'react'
import { Leaf, Clock, Car, Lightbulb, Zap } from 'lucide-react'
import { t } from '../lib/i18n'

interface ResultCardProps {
  result: {
    co2Grams: number
    tokens: number
    model: {
      name: string
      vendor: string
    }
    comparisons: Array<{
      type: string
      value: number
      unit: string
      description: string
      icon: string
    }>
    inputMode: 'prompt' | 'tokens'
    originalPrompt?: string
  }
}

export default function ResultCard({ result }: ResultCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'car':
        return <Car className="h-5 w-5" />
      case 'lightbulb':
        return <Lightbulb className="h-5 w-5" />
      case 'leaf':
        return <Leaf className="h-5 w-5" />
      case 'clock':
        return <Clock className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Main Result */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="bg-green-100 p-4 rounded-2xl inline-block mb-6">
          <Leaf className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {result.co2Grams.toFixed(2)}g CO₂
        </h2>
        
        <p className="text-gray-600 mb-4">
          {t('result.generated')} {result.tokens.toLocaleString()} {t('result.tokens')}
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            <strong>{result.model.vendor} {result.model.name}</strong>
            {result.inputMode === 'prompt' && result.originalPrompt && (
              <>
                <br />
                <span className="italic">"{result.originalPrompt.substring(0, 100)}..."</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Comparisons */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          {t('result.comparisons')}
        </h3>
        
        <div className="grid gap-4">
          {result.comparisons.map((comparison, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                {getIcon(comparison.icon)}
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {comparison.description}
                </p>
                <p className="text-sm text-gray-600">
                  {comparison.value} {comparison.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
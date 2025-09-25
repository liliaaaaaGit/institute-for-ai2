'use client'

import { useState } from 'react'
import { Car, Monitor, Smartphone, ExternalLink, Download, Lightbulb, Home, Info } from 'lucide-react'
import { buildComparisons, assumptionsText } from '@/lib/comparisons'
import { h3, body, buttonPrimary, card } from './Ui'
import { t, formatNumber } from '../i18n'

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
}

interface Props {
  result: CalculationResult
  onGetReport: () => void
}

const comparisonIcons = {
  'pc': Monitor,
  'car': Car,
  'led': Lightbulb,
  'phone': Smartphone,
  'household': Home,
}

export default function ResultCard({ result, onGetReport }: Props) {
  const [showAllComparisons, setShowAllComparisons] = useState(false)
  const [showAssumptions, setShowAssumptions] = useState(false)
  
  const comparisons = buildComparisons(result.co2Grams)
  
  const displayedComparisons = showAllComparisons 
    ? comparisons 
    : comparisons.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="text-center p-6 bg-[radial-gradient(circle_at_50%_0%,#D521000A,transparent_70%)] rounded-2xl border border-brand-red/20">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-brand-red/10 p-3 rounded-2xl">
            <img 
              src="/Key Visual.png" 
              alt="AI Logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
        </div>
        
        <h3 className={`${h3} mb-2`}>
          {t('result.grams', { value: formatNumber(result.co2Grams, 2) })}
        </h3>
        
        <div className={`text-sm text-brand-ink/70 space-y-1`}>
          <p>{result.tokens} tokens • {result.model.name}</p>
          <p>{result.model.vendor}</p>
        </div>
      </div>

      {/* Comparisons */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-heading font-semibold text-brand-ink">{t('result.comparisons')}</h4>
          <button
            onClick={() => setShowAssumptions(!showAssumptions)}
            className="text-brand-ink/40 hover:text-brand-ink/60 p-1 rounded-lg focus:outline-none focus:shadow-focus"
            title="Annahmen anzeigen"
          >
            <Info className="h-4 w-4" stroke="currentColor" strokeWidth="2" />
          </button>
        </div>
        
        {showAssumptions && (
          <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl p-3 mb-3 text-xs text-brand-ink/80">
            {assumptionsText}
          </div>
        )}
        
        <div className="space-y-3">
          {displayedComparisons.map((comparison, index) => {
            const IconComponent = comparisonIcons[comparison.key as keyof typeof comparisonIcons] || Monitor
            
            return (
              <div key={index} className="flex items-center p-3 bg-brand-ink/5 rounded-xl">
                <div className="bg-brand-white p-2 rounded-xl mr-3">
                  <IconComponent className="h-4 w-4" stroke="#D52100" strokeWidth="2" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-brand-ink text-sm">{comparison.value}</p>
                  <p className={`text-xs text-brand-ink/60`}>
                    {comparison.label}{comparison.detail ? ` · ${comparison.detail}` : ''}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        
        {comparisons.length > 3 && (
          <button
            onClick={() => setShowAllComparisons(!showAllComparisons)}
            className="text-sm text-brand-red hover:text-brand-red/80 mt-3 font-medium"
          >
            {showAllComparisons ? t('result.showLess') : t('result.showMore', { count: comparisons.length - 3 })}
          </button>
        )}
      </div>

      {/* Public Report Link */}
      <div className="p-4 bg-brand-ink/5 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-brand-ink text-sm">{t('result.shareTitle')}</p>
            <p className={`text-xs text-brand-ink/60`}>{t('result.shareDesc')}</p>
          </div>
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/report/${result.publicSlug}`
              console.log('=== SHARE BUTTON CLICKED ===')
              console.log('Share URL:', shareUrl)
              console.log('Public slug:', result.publicSlug)
              console.log('Current localStorage keys:', Object.keys(localStorage))
              
              navigator.clipboard.writeText(shareUrl).then(() => {
                alert(t('result.linkCopied'))
              }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea')
                textArea.value = shareUrl
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
                alert(t('result.linkCopied'))
              })
            }}
            className="flex items-center text-brand-red hover:text-brand-red/80 text-sm font-medium"
          >
            {t('result.copyLink')} <ExternalLink className="h-4 w-4 ml-1" stroke="currentColor" strokeWidth="2" />
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t pt-6">
        <button
          onClick={onGetReport}
          className={`${buttonPrimary} w-full justify-center`}
        >
          <Download className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2.5" />
          {t('cta.getReport')}
        </button>
        <p className={`text-xs text-brand-ink/60 text-center mt-2`}>
          {t('cta.getReportDesc')}
        </p>
      </div>
    </div>
  )
}
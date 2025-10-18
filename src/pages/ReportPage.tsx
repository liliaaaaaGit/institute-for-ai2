import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Brain, BarChart3, Car, Monitor, Smartphone, ArrowLeft, Share2, Lightbulb, Home } from 'lucide-react'
import { buildComparisons } from '../lib/comparisons'
import { h1, h2, h3, body, container, section, card, buttonPrimary, buttonSecondary } from '../components/Ui'
import { t, formatNumber, formatDate, formatDateShort } from '../lib/i18n'

const comparisonIcons = {
  'pc': Monitor,
  'car': Car,
  'led': Lightbulb,
  'phone': Smartphone,
  'household': Home,
}

// Sample report data for demonstration - in a real app this would come from the database
const createSampleReport = (reportId: string) => ({
  sessionId: reportId,
  publicSlug: reportId,
  co2Grams: 2.8,
  tokens: 125,
  model: {
    id: '1',
    name: 'GPT-4',
    vendor: 'OpenAI',
    grams_per_1k_tokens: 8.5,
    is_active: true
  },
  timestamp: new Date().toISOString(),
  inputMode: 'prompt' as const,
  originalPrompt: 'Write a comprehensive guide on sustainable AI practices and how to reduce carbon footprint when using AI tools.',
  calculationDetails: {
    emissionFactor: 8.5,
    tokenEstimationMethod: t('report.methodologyTokensPrompt'),
    calculationFormula: '125 Tokens × 0,0085g CO₂/Token = 2,8g CO₂'
  },
  comparisons: buildComparisons(2.8)
})

export default function ReportPage() {
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    if (slug) {
      loadReportData()
    }
  }, [slug])

  async function loadReportData() {
    try {
      console.log('Loading report for slug:', slug)
      
      // Try to load from localStorage first
      const storageKey = `report_${slug}`
      const storedData = localStorage.getItem(storageKey)
      
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          console.log('Found stored report data:', data)
          setReportData(data)
          setLoading(false)
          return
        } catch (parseError) {
          console.error('Error parsing stored data:', parseError)
        }
      }
      
      // If no stored data found, create sample report for demonstration
      console.log('No stored data found, creating sample report')
      const sampleReport = createSampleReport(slug!)
      setReportData(sampleReport)
      
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`${container} ${section} max-w-3xl`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-red border-t-transparent mx-auto mb-4"></div>
          <p>{t('report.loading')}</p>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className={`${container} ${section} max-w-3xl`}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-brand-red/10 p-3 rounded-2xl">
              <Brain className="h-8 w-8" stroke="#D52100" strokeWidth="2.5" />
            </div>
          </div>
          <h1 className={`${h1} mb-2`}>
            {t('report.notFound')}
          </h1>
          <p className={`${body} mb-2`}>
            {t('report.notFoundDesc')}
          </p>
          <p className={`text-sm text-brand-ink/60 mb-6`}>
            {t('report.reportId', { id: slug })}
          </p>
          <Link to="/" className={buttonPrimary}>
            <ArrowLeft className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2.5" />
            {t('report.backToCalculator')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`${container} ${section} max-w-3xl`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-brand-red/10 p-4 rounded-2xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M4 20L12 4l8 16" stroke="#D52100" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h1 className={`${h1} mb-2`}>
          {t('report.title')}
        </h1>
        <p className={body}>
          {t('report.subtitle')}
        </p>
      </div>

      {/* Main Result */}
      <div className={`${card} mb-8`}>
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
          
          <h3 className={`${h2} mb-2`}>
            {t('result.grams', { value: formatNumber(reportData.co2Grams, 2) })}
          </h3>
          
          <div className={`text-sm text-brand-ink/70 space-y-1 mb-4`}>
            <p>{reportData.tokens} tokens • {reportData.model.name}</p>
            <p>{reportData.model.vendor}</p>
          </div>
          
          <div className={`flex items-center justify-center text-xs text-brand-ink/60`}>
            <Calendar className="h-4 w-4 mr-1" stroke="currentColor" strokeWidth="2" />
            {formatDate(reportData.timestamp)}
          </div>
        </div>
      </div>

      {/* Calculation Details */}
      <div className={`${card} mb-8`}>
        <h4 className={`font-heading font-semibold text-brand-ink mb-4 flex items-center`}>
          <BarChart3 className="h-5 w-5 mr-2" stroke="#D52100" strokeWidth="2.5" />
          {t('report.calculationDetails')}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-brand-ink/5 p-4 rounded-xl">
            <p className={`text-sm font-medium text-brand-ink/70`}>{t('report.inputMethod')}</p>
            <p className={`text-lg text-brand-ink capitalize`}>{reportData.inputMode}</p>
          </div>
          <div className="bg-brand-ink/5 p-4 rounded-xl">
            <p className={`text-sm font-medium text-brand-ink/70`}>{t('report.tokenCount')}</p>
            <p className={`text-lg text-brand-ink`}>{formatNumber(reportData.tokens, 0)}</p>
          </div>
          <div className="bg-brand-ink/5 p-4 rounded-xl">
            <p className={`text-sm font-medium text-brand-ink/70`}>{t('report.emissionFactor')}</p>
            <p className={`text-lg text-brand-ink`}>{formatNumber(reportData.model.grams_per_1k_tokens, 1)}g CO₂/1k Tokens</p>
          </div>
          <div className="bg-brand-ink/5 p-4 rounded-xl">
            <p className={`text-sm font-medium text-brand-ink/70`}>{t('report.totalEmissions')}</p>
            <p className={`text-lg text-brand-ink font-semibold`}>{formatNumber(reportData.co2Grams, 2)}g CO₂</p>
          </div>
        </div>
        
        {reportData.calculationDetails && (
          <div className="mt-4 p-4 bg-brand-red/5 rounded-xl">
            <p className={`text-sm font-medium text-brand-ink mb-2`}>{t('report.calculationFormula')}</p>
            <p className={`text-sm text-brand-ink/80 font-mono`}>{reportData.calculationDetails.calculationFormula}</p>
          </div>
        )}
      </div>

      {/* Real-world Comparisons */}
      <div className={`${card} mb-8`}>
        <h4 className={`font-heading font-semibold text-brand-ink mb-4`}>{t('report.comparisons')}</h4>
        <div className="space-y-3">
          {reportData.comparisons.map((comparison: any, index: number) => {
            const IconComponent = comparisonIcons[comparison.key as keyof typeof comparisonIcons] || Monitor
            
            return (
              <div key={index} className="flex items-center p-4 bg-brand-ink/5 rounded-xl">
                <div className="bg-brand-white p-2 rounded-xl mr-4">
                  <IconComponent className="h-5 w-5" stroke="#D52100" strokeWidth="2" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-brand-ink`}>{comparison.value}</p>
                  <p className={`text-sm text-brand-ink/60`}>
                    {comparison.label}{comparison.detail ? ` · ${comparison.detail}` : ''}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Original Prompt (if available) */}
      {reportData.originalPrompt && (
        <div className={`${card} mb-8`}>
          <h4 className={`font-heading font-semibold text-brand-ink mb-4`}>{t('report.originalPrompt')}</h4>
          <div className="bg-brand-ink/5 p-4 rounded-xl">
            <p className={`text-brand-ink/90 whitespace-pre-wrap`}>{reportData.originalPrompt}</p>
          </div>
        </div>
      )}

      {/* Share Section */}
      <div className={`${card} mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-heading font-semibold text-brand-ink`}>{t('report.shareReport')}</h4>
            <p className={`text-sm text-brand-ink/60`}>{t('report.shareDesc')}</p>
          </div>
          <button
            onClick={() => {
              const shareUrl = window.location.href
              if (navigator.share) {
                navigator.share({
                  title: `CO₂-Bericht: ${formatNumber(reportData.co2Grams, 2)}g CO₂`,
                  text: `Mein KI-Prompt hat ${formatNumber(reportData.co2Grams, 2)}g CO₂-Emissionen erzeugt`,
                  url: shareUrl
                })
              } else {
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
              }
            }}
            className="flex items-center text-brand-red hover:text-brand-red/80 font-medium focus:outline-none focus:shadow-focus rounded-lg p-2"
          >
            <Share2 className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2" />
            {t('report.copyLink')}
          </button>
        </div>
      </div>

      {/* Methodology */}
      <div className={`${card} mb-8`}>
        <h4 className={`font-heading font-semibold text-brand-ink mb-4`}>{t('report.methodology')}</h4>
        <div className={`text-sm text-brand-ink/80 space-y-2`}>
          <p>
            {t('report.methodologyCalc', { factor: formatNumber(reportData.model.grams_per_1k_tokens, 1) })}
          </p>
          <p>
            <strong>Token-Schätzung:</strong> {reportData.inputMode === 'prompt' 
              ? t('report.methodologyTokensPrompt')
              : t('report.methodologyTokensUser')}
          </p>
          <p>
            <strong>Emissionsfaktoren:</strong> {t('report.methodologyFactors')}
          </p>
          <p>
            <strong>Vergleiche:</strong> {t('report.methodologyComparisons')}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Link to="/" className={buttonSecondary}>
          <ArrowLeft className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2.5" />
          {t('report.backToCalculator')}
        </Link>
        <button
          onClick={() => {
            const shareUrl = window.location.href
            if (navigator.share) {
              navigator.share({
                title: `CO₂-Bericht: ${formatNumber(reportData.co2Grams, 2)}g CO₂`,
                text: `Mein KI-Prompt hat ${formatNumber(reportData.co2Grams, 2)}g CO₂-Emissionen erzeugt`,
                url: shareUrl
              })
            } else {
              navigator.clipboard.writeText(shareUrl).then(() => {
                alert(t('result.linkCopied'))
              })
            }
          }}
          className={buttonPrimary}
        >
          <Share2 className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2.5" />
          {t('report.shareButton')}
        </button>
      </div>

      {/* Footer */}
      <div className={`text-center mt-8 text-xs text-brand-ink/60`}>
        <p>
          {t('report.generatedOn', { id: slug, date: formatDateShort(reportData.timestamp) })}
        </p>
      </div>
    </div>
  )
}
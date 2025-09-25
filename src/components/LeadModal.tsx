'use client'

import { useState } from 'react'
import { X, Mail, Shield, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { saveLead } from '@/lib/leads'
import { sendReport } from '@/lib/emailService'
import { co2EmailHtml } from '@/emails/Co2Report.html'
import { h3, body, buttonPrimary, buttonSecondary } from './Ui'
import { t } from '../i18n'

type ReportData = {
  sessionId?: string;
  publicSlug?: string;
  co2Grams: number;
  tokens?: number;
  originalPrompt?: string;
  model: { name: string } | string;
  comparisons?: Array<{ label: string; value: string }>;
};

interface Props {
  sessionId: string
  onClose: () => void
}

export default function LeadModal({ sessionId, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [consentMarketing, setConsentMarketing] = useState(false)
  const [consentRequired, setConsentRequired] = useState(false)
  const [sending, setSending] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !consentRequired) return
    
    setSending(true)
    
    try {
      console.debug('Submit lead', { email, consentRequired })
      
      // Get stored report data
      const storageKey = `report_${sessionId}`
      const storedData = localStorage.getItem(storageKey)
      
      if (!storedData) {
        throw new Error('Report data not found')
      }
      
      const reportData: ReportData = JSON.parse(storedData)
      
      // 1) Save lead (RLS requires consent_marketing=true)
      await saveLead(email, consentRequired, {
        source: 'co2-report', 
        sessionId: reportData?.sessionId,
        publicSlug: reportData?.publicSlug,
        tokens: reportData?.tokens,
        model: typeof reportData?.model === 'string' ? reportData.model : reportData?.model?.name,
        co2Grams: reportData?.co2Grams,
      })

      // 2) Build email HTML + send
      const subject = `Ihr CO₂-Bericht – ${
        typeof reportData?.model === 'string' ? reportData.model : (reportData?.model?.name ?? 'AI Model')
      }`
      const html = co2EmailHtml({
        resultGrams: reportData.co2Grams,
        model: typeof reportData.model === 'string' ? reportData.model : reportData.model.name,
        tokens: reportData.tokens,
        prompt: reportData.originalPrompt,
        comparisons: reportData.comparisons ?? [],
      })
      
      await sendReport(email, subject, html)
      
      // Success - navigate to thanks page
      navigate('/thanks')
    } catch (e: any) {
      const msg = String(e?.message || '')
      if (msg.includes('DUPLICATE_DAY') || msg.includes('23505')) {
        alert('Sie haben heute bereits einen Bericht angefordert.')
      } else if (msg.includes('row-level security')) {
        alert('Bitte stimmen Sie der Datenverarbeitung zu (Checkbox).')
      } else if (msg.startsWith('EMAIL_FAIL_') || msg.includes('Email')) {
        alert('E-Mail-Versand fehlgeschlagen. Bitte später erneut versuchen.')
      } else {
        alert('Fehler beim Speichern oder E-Mail-Versand. Bitte versuchen Sie es erneut.')
      }
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-brand-ink bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-brand-white rounded-2xl max-w-md w-full p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-brand-red/10 p-2 rounded-xl mr-3">
              <Mail className="h-5 w-5" stroke="#D52100" strokeWidth="2.5" />
            </div>
            <h3 className={h3}>{t('lead.title')}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-brand-ink/40 hover:text-brand-ink/60 focus:outline-none focus:shadow-focus rounded-lg p-1"
          >
            <X className="h-5 w-5" stroke="currentColor" strokeWidth="2" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium text-brand-ink mb-2`}>
              {t('lead.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('lead.emailPlaceholder')}
              className="input-field"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="consent-required"
                checked={consentRequired}
                onChange={(e) => setConsentRequired(e.target.checked)}
                className="mt-1 rounded border-brand-ink/30 text-brand-red focus:ring-brand-red focus:ring-2"
                required
              />
              <label htmlFor="consent-required" className={`ml-3 text-sm text-brand-ink/90`} dangerouslySetInnerHTML={{
                __html: t('lead.consentRequired').replace('Datenschutzhinweisen', `<a href="#" class="text-brand-red hover:underline">Datenschutzhinweisen</a>`)
              }}>
              </label>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="consent-marketing"
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
                className="mt-1 rounded border-brand-ink/30 text-brand-red focus:ring-brand-red focus:ring-2"
              />
              <label htmlFor="consent-marketing" className={`ml-3 text-sm text-brand-ink/90`}>
                {t('lead.consentMarketing')}
              </label>
            </div>
          </div>

          <div className="bg-brand-red/5 border border-brand-red/20 rounded-xl p-3">
            <div className="flex items-start">
              <Shield className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" stroke="#D52100" strokeWidth="2" />
              <div className={`text-xs text-brand-ink`}>
                <p className="font-medium text-brand-ink">{t('lead.doubleOptIn')}</p>
                <p>{t('lead.doubleOptInDesc')}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`${buttonSecondary} flex-1 justify-center`}
            >
              {t('lead.cancel')}
            </button>
            <button
              type="submit"
              disabled={sending || !email || !consentRequired}
              className={`${buttonPrimary} flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  Senden…
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2.5" />
                  {t('lead.getReport')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
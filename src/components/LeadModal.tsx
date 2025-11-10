import React, { useState } from 'react'
import { X, Mail, Shield, CheckCircle } from 'lucide-react'
import { upsertLead } from '../lib/leads'
import { t } from '../lib/i18n'

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId?: string
  reportData?: any
  onReportConfirmed?: () => void
}

export default function LeadModal({ 
  isOpen, 
  onClose, 
  sessionId = 'pending', 
  reportData,
  onReportConfirmed 
}: LeadModalProps) {
  const [email, setEmail] = useState('')
  const [consentRequired, setConsentRequired] = useState(false)
  const [consentMarketing, setConsentMarketing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email.trim()) {
      setError(t('error.emailRequired'))
      return
    }
    
    if (!consentRequired) {
      setError(t('error.consentRequired'))
      return
    }

    setIsSubmitting(true)

    try {
      await upsertLead({
        email: email.trim(),
        consent_marketing: consentMarketing,
        consent_policy_version: 'v1',
        sessionId,
        meta: reportData
      })

      // For new flow (sessionId === 'pending'), call the callback
      if (sessionId === 'pending' && onReportConfirmed) {
        onReportConfirmed()
      } else {
        // For existing flow, close modal and potentially navigate
        onClose()
      }
    } catch (error) {
      console.error('Lead submission failed:', error)
      setError(t('error.submitFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('modal.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            {t('modal.description')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('form.emailPlaceholder')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Required Consent */}
            <div className="flex items-start gap-3">
              <input
                id="consent-required"
                type="checkbox"
                checked={consentRequired}
                onChange={(e) => setConsentRequired(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="consent-required" className="text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-red-500" />
                  {t('consent.required')}
                </span>
              </label>
            </div>

            {/* Marketing Consent */}
            <div className="flex items-start gap-3">
              <input
                id="consent-marketing"
                type="checkbox"
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="consent-marketing" className="text-sm text-gray-700">
                {t('consent.marketing')}
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  {t('button.submitting')}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {t('button.getReport')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
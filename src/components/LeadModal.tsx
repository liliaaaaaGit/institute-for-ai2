import React, { useState } from 'react'
import { X, Mail, Shield, CheckCircle } from 'lucide-react'
import { upsertLead } from '../lib/leads'
import { t } from '../lib/i18n'

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  onReportConfirmed?: () => void
  reportData?: any
}

export default function LeadModal({ 
  isOpen, 
  onClose, 
  sessionId, 
  onReportConfirmed,
  reportData 
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
      const meta = {
        sessionId,
        ...(reportData && { reportData })
      }

      await upsertLead(
        email.trim(),
        consentMarketing,
        meta
      )

      // If this is the new flow (email collection before calculation)
      if (sessionId === 'pending' && onReportConfirmed) {
        onReportConfirmed()
      } else {
        // Existing flow - close modal and potentially navigate
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('modal.title')}
            </h2>
          </div>
          <p className="text-gray-600">
            {t('modal.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.email')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('form.emailPlaceholder')}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="consentRequired"
                checked={consentRequired}
                onChange={(e) => setConsentRequired(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="consentRequired" className="ml-2 text-sm text-gray-700">
                <span className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-gray-500" />
                  {t('consent.required')}
                </span>
              </label>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="consentMarketing"
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="consentMarketing" className="ml-2 text-sm text-gray-700">
                {t('consent.marketing')}
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              {t('button.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('button.getReport')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
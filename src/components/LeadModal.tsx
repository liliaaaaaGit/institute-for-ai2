import React, { useState } from 'react';
import { X, Mail, Shield, CheckCircle } from 'lucide-react';
import { upsertLead } from '../lib/leads';

interface LeadModalProps {
  sessionId: string;
  formData: any;
  onClose: () => void;
  onReportConfirmed: () => void;
}

export default function LeadModal({ sessionId, formData, onClose, onReportConfirmed }: LeadModalProps) {
  const [email, setEmail] = useState('');
  const [consentReport, setConsentReport] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!consentReport) {
      setError('You must consent to receive the CO₂ report');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await upsertLead({
        email: email.trim(),
        sessionId,
        consent_marketing: consentMarketing,
        consent_policy_version: '1.0',
        meta: {
          formData,
          timestamp: new Date().toISOString()
        }
      });

      onReportConfirmed();
    } catch (err) {
      console.error('Lead upsert failed:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Mail className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Get Your CO₂ Report</h2>
          </div>
          <p className="text-gray-600">
            Enter your email to receive your personalized CO₂ footprint analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="consentReport"
                checked={consentReport}
                onChange={(e) => setConsentReport(e.target.checked)}
                className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="consentReport" className="text-sm text-gray-700">
                <span className="font-medium">Required:</span> I consent to receive my CO₂ footprint report via email.
              </label>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="consentMarketing"
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
                className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="consentMarketing" className="text-sm text-gray-700">
                <span className="font-medium">Optional:</span> I would like to receive tips and updates about sustainability.
              </label>
            </div>
          </div>

          <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
            <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              Your data is protected and will only be used to send your report. 
              You can unsubscribe at any time.
            </span>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !consentReport}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Send Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
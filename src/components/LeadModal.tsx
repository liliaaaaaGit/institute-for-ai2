import React, { useState } from 'react';
import { X, Mail, Shield } from 'lucide-react';
import { upsertLead } from '../lib/leads';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onReportConfirmed: () => void;
  reportData?: any;
}

export default function LeadModal({ 
  isOpen, 
  onClose, 
  sessionId, 
  onReportConfirmed, 
  reportData 
}: LeadModalProps) {
  const [email, setEmail] = useState('');
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting lead:', { email: email.trim(), consentMarketing, sessionId });
      
      await upsertLead(
        email.trim(),
        consentMarketing,
        {
          sessionId,
          ...(reportData && { reportData })
        }
      );

      console.log('Lead submitted successfully');
      
      // Close modal and trigger report confirmation
      onClose();
      onReportConfirmed();
      
    } catch (error) {
      console.error('Lead submission failed:', error);
      setError('Failed to submit email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Get Your AI Carbon Report
          </h2>
          <p className="text-gray-600">
            Enter your email to receive your personalized carbon footprint analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent"
              checked={consentMarketing}
              onChange={(e) => setConsentMarketing(e.target.checked)}
              className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="consent" className="text-sm text-gray-600 flex-1">
              <Shield className="w-4 h-4 inline mr-1" />
              I agree to receive marketing communications and updates about sustainability insights
            </label>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Get My Report'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          We respect your privacy. Your email will only be used to send your carbon report and optional updates.
        </p>
      </div>
    </div>
  );
}
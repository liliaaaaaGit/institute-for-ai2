import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, Download, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { h1, h2, body, container, section, card, buttonPrimary } from '../components/Ui'
import { t } from '../lib/i18n'

export default function ConfirmPage() {
  const { token } = useParams<{ token: string }>()
  const [confirmed, setConfirmed] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      confirmLead()
    }
  }, [token])

  async function confirmLead() {
    try {
      const { data, error } = await supabase
        .rpc('confirm_lead', {
          p_confirmation_token: token
        })
        
      if (error) {
        console.error('Confirmation error:', error)
        setConfirmed(false)
      } else {
        setConfirmed(!!data)
      }
    } catch (error) {
      console.error('Confirmation failed:', error)
      setConfirmed(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`${container} ${section} max-w-2xl`}>
        <div className="text-center">{t('confirm.confirming')}</div>
      </div>
    )
  }

  if (!confirmed) {
    return (
      <div className={`${container} ${section} max-w-2xl`}>
        <div className="text-center">
          <h1 className={`${h1} mb-4`}>
            {t('confirm.failed')}
          </h1>
          <p className={`${body} text-xl mb-8`}>
            {t('confirm.failedDesc')}
          </p>
          <Link to="/" className={buttonPrimary}>
            <ArrowLeft className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2.5" />
            {t('confirm.backToCalculator')}
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`${container} ${section} max-w-2xl`}>
      <div className="text-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-brand-red/10 p-4 rounded-2xl">
            <CheckCircle className="h-16 w-16" stroke="#D52100" strokeWidth="2.5" />
          </div>
        </div>

        {/* Header */}
        <h1 className={`${h1} mb-4`}>
          {t('confirm.title')}
        </h1>
        <p className={`${body} text-xl mb-8`}>
          {t('confirm.subtitle')}
        </p>

        {/* Report Info */}
        <div className={`${card} text-left mb-8`}>
          <div className="flex items-start mb-4">
            <div className="bg-brand-red/10 p-2 rounded-xl mr-3 mt-1">
              <Download className="h-5 w-5" stroke="#D52100" strokeWidth="2.5" />
            </div>
            <div>
              <h3 className={`font-heading font-semibold text-brand-ink mb-2`}>{t('confirm.reportIncludes')}</h3>
              <ul className={`text-brand-ink/80 space-y-1`}>
                <li>{t('confirm.reportItem1')}</li>
                <li>{t('confirm.reportItem2')}</li>
                <li>{t('confirm.reportItem3')}</li>
                <li>{t('confirm.reportItem4')}</li>
                <li>{t('confirm.reportItem5')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-4 mb-8 text-left">
          <h4 className={`font-medium text-brand-ink mb-2`}>{t('confirm.subscriberBenefits')}</h4>
          <ul className={`text-sm text-brand-ink/80 space-y-1`}>
            <li>{t('confirm.benefit1')}</li>
            <li>{t('confirm.benefit2')}</li>
            <li>{t('confirm.benefit3')}</li>
            <li>{t('confirm.benefit4')}</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link to="/" className={buttonPrimary}>
            <ArrowLeft className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2.5" />
            {t('confirm.backToCalculator')}
          </Link>
          
          <p className={`text-sm text-brand-ink/60`}>
            {t('confirm.deliveryNote')}
          </p>
        </div>
      </div>
    </div>
  )
}
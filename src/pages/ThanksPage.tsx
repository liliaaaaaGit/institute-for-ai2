import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { h1, h2, body, container, section, card, buttonPrimary } from '../components/Ui'
import { t } from '../i18n'

export default function ThanksPage() {
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
          {t('thanks.title')}
        </h1>
        <p className={`${body} text-xl mb-8`}>
          {t('thanks.subtitle')}
        </p>

        {/* Instructions Card */}
        <div className={`${card} text-left mb-8`}>
          <div className="flex items-start mb-4">
            <div className="bg-brand-red/10 p-2 rounded-xl mr-3 mt-1">
              <Mail className="h-5 w-5" stroke="#D52100" strokeWidth="2.5" />
            </div>
            <div>
              <h3 className={`font-heading font-semibold text-brand-ink mb-2`}>{t('thanks.whatsNext')}</h3>
              <ol className={`list-decimal list-inside space-y-2 text-brand-ink/80`}>
                <li>{t('thanks.step1')}</li>
                <li>{t('thanks.step2')}</li>
                <li>{t('thanks.step3')}</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-4 mb-8 text-left">
          <h4 className={`font-medium text-brand-ink mb-2`}>{t('thanks.reportIncludes')}</h4>
          <ul className={`text-sm text-brand-ink/80 space-y-1`}>
            <li>{t('thanks.reportItem1')}</li>
            <li>{t('thanks.reportItem2')}</li>
            <li>{t('thanks.reportItem3')}</li>
            <li>{t('thanks.reportItem4')}</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link to="/" className={buttonPrimary}>
            <ArrowLeft className="h-4 w-4 mr-2" stroke="currentColor" strokeWidth="2.5" />
            {t('thanks.backToCalculator')}
          </Link>
          
          <p className={`text-sm text-brand-ink/60`}>
            {t('thanks.noEmail')}
          </p>
        </div>
      </div>
    </div>
  )
}
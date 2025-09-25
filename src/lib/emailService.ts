import { EmailReportData, generateEmailHTML, generateEmailText, generateEmailSubject } from './emailTemplates';
import { buildComparisons } from './comparisons';

export async function sendEmailReport(email: string, reportData: any): Promise<void> {
  try {
    // Get comparisons using the existing logic
    const comparisons = buildComparisons(reportData.co2Grams);
    
    // Prepare email data
    const emailData: EmailReportData = {
      co2Grams: reportData.co2Grams,
      tokens: reportData.tokens,
      modelName: reportData.model.name,
      provider: reportData.model.vendor,
      originalPrompt: reportData.originalPrompt,
      comparisons: {
        pc: comparisons.find(c => c.key === 'pc')?.value || '',
        car: comparisons.find(c => c.key === 'car')?.value || '',
        household: comparisons.find(c => c.key === 'household')?.value || '',
        phone: comparisons.find(c => c.key === 'phone')?.value || '',
        led: comparisons.find(c => c.key === 'led')?.value || ''
      },
      sessionId: reportData.sessionId,
      timestamp: reportData.timestamp
    };

    // Generate email content
    const subject = generateEmailSubject(emailData);
    const html = generateEmailHTML(emailData);
    const text = generateEmailText(emailData);

    // Check if we're in development mode
    const isDevelopment = import.meta.env.DEV || !import.meta.env.PROD
    
    if (isDevelopment) {
      // In development, just log the email content and simulate success
      console.log('📧 Development Mode - Email would be sent to:', email)
      console.log('📧 Subject:', subject)
      console.log('📧 HTML length:', html.length, 'characters')
      console.log('📧 Text length:', text.length, 'characters')
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return
    }

    // Try to send via API (production only)
    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject,
          html: html,
        }),
      })
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Email API failed:', errorText);
        throw new Error(`Email API failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Email sending failed, but continuing:', error);
      // In production, we'll just log the error and continue
      // This prevents the app from breaking if email service is down
    }

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
// /src/lib/emailService.ts (Beispiel)
import { Resend } from 'resend'
import fs from 'node:fs'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendReport(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject,
    html,
    attachments: [{
      filename: 'ai-logo-red.png',
      content: fs.readFileSync('public/ai-logo-red.png'),
      contentId: 'ai-logo',          // <- Referenzname
      disposition: 'inline',
      mimeType: 'image/png'
    }]
  })
}

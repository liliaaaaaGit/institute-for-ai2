# German CO₂ Report Email System

This system sends comprehensive German CO₂ reports via email using Resend.

## Setup

1. **Install dependencies:**
   ```bash
   npm install resend
   ```

2. **Environment variables:**
   ```bash
   RESEND_API_KEY=re_your_api_key_here
   FROM_EMAIL="Institute for AI <report@yourdomain.com>"
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

3. **Resend setup:**
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from the dashboard
   - Verify your sending domain

## Usage

### Basic Implementation

```typescript
import { sendCo2ReportEmail } from './src/server/sendReportEmail';
import { createEmailReportData } from './src/lib/emailData';

// Create email data from session
const emailData = createEmailReportData('user@example.com', {
  sessionId: 'calc_123',
  co2Grams: 2.8,
  tokens: 125,
  modelName: 'GPT-4',
  provider: 'OpenAI',
  originalPrompt: 'Write a guide on sustainable AI...',
  timestamp: new Date().toISOString()
});

// Send the email
await sendCo2ReportEmail(emailData);
```

### API Route Example

```typescript
// pages/api/send-report.ts or similar
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate confirmed lead (implement your logic)
    const isConfirmed = await validateConfirmedLead(body.email, body.sessionId);
    if (!isConfirmed) {
      return Response.json({ error: 'Email not confirmed' }, { status: 403 });
    }

    const result = await handleSendReport(body);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: 'Failed to send report' }, { status: 500 });
  }
}
```

## Email Content

The email includes:

- **Summary**: CO₂ result, tokens, model, date
- **Real-world comparisons**: PC usage, car travel, household electricity, smartphone charges, LED bulb
- **Input details**: Prompt excerpt, token counting method
- **Optimization tips**: Model selection, prompt trimming, batching, caching, output limiting
- **Model efficiency table**: All models with g CO₂/1k tokens and recommendations
- **Methodology**: Assumptions, formulas, version date
- **Compliance footer**: Unsubscribe, privacy policy links

## Templates

- **HTML**: Responsive design with Raleway font, brand colors (#D52100, #1C0202)
- **Plain text**: Clean, structured format for email clients without HTML support
- **Subject**: "Dein KI-CO₂-Bericht — 2,8 g CO₂ für 125 Tokens (GPT-4)"

## Compliance

- Only sends to confirmed leads (Double-Opt-In)
- Includes unsubscribe link in every email
- Privacy policy link included
- Stores consent timestamps and policy versions

## Customization

### Model Efficiency Data

Edit `src/lib/emailData.ts` to update model recommendations:

```typescript
export const modelEfficiencyData = [
  { name: 'New Model', gPer1k: '3,5', bestFor: 'Specific use case' },
  // ...
];
```

### Email Styling

Modify `src/emails/reportTemplates.ts` for design changes. Uses inline CSS for maximum email client compatibility.

### Comparison Formulas

The system uses the same formulas as the web app from `src/lib/comparisons.ts`:
- Desktop PC: CO₂[g] / 60
- Car: CO₂[g] / 150  
- Household: CO₂[g] / 160
- Smartphone: CO₂[g] / 2.4
- LED: CO₂[g] / 4

## Testing

Test emails in development:

```typescript
// Test with sample data
const testData = createEmailReportData('test@example.com', {
  sessionId: 'test_123',
  co2Grams: 5.2,
  tokens: 250,
  modelName: 'GPT-4',
  provider: 'OpenAI',
  originalPrompt: 'Test prompt for email generation...',
  timestamp: new Date().toISOString()
});

await sendCo2ReportEmail(testData);
```

## Error Handling

The system throws errors for:
- Missing environment variables
- Resend API failures
- Invalid email data

Implement proper error logging and user feedback in your application.
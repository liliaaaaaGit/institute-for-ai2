// This would be implemented as an API route in your framework
// For Vite/React, you might use a serverless function or backend service

import { sendCo2ReportEmail } from '../server/sendReportEmail';
import { createEmailReportData } from '../lib/emailData';

export interface SendReportRequest {
  email: string;
  sessionId: string;
  co2Grams: number;
  tokens: number;
  modelName: string;
  provider: string;
  originalPrompt?: string;
  timestamp: string;
}

export async function handleSendReport(request: SendReportRequest) {
  try {
    // Validate that the lead is confirmed (this would check your database)
    // const lead = await validateConfirmedLead(request.email, request.sessionId);
    // if (!lead) throw new Error('Lead not confirmed');

    const emailData = createEmailReportData(request.email, {
      sessionId: request.sessionId,
      co2Grams: request.co2Grams,
      tokens: request.tokens,
      modelName: request.modelName,
      provider: request.provider,
      originalPrompt: request.originalPrompt,
      timestamp: request.timestamp
    });

    await sendCo2ReportEmail(emailData);

    return { success: true };
  } catch (error) {
    console.error('Failed to send report email:', error);
    throw error;
  }
}

// Example usage in a serverless function or API route:
/*
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await handleSendReport(body);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: 'Failed to send report' }, { status: 500 });
  }
}
*/
# Deployment Setup Guide

## Environment Variables Required

To enable email functionality in your deployed application, you need to set the following environment variables in your Bolt Hosting project settings:

### Required Variables:

1. **RESEND_API_KEY** (Required for email sending)
   - Get this from [resend.com](https://resend.com)
   - Sign up for a free account
   - Go to API Keys section
   - Create a new API key
   - Format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

2. **FROM_EMAIL** (Required for email sending)
   - Must be a verified domain in Resend
   - Format: `"Your Name <noreply@yourdomain.com>"`
   - For testing, you can use: `"Institute for AI <onboarding@resend.dev>"`

3. **REPLY_TO** (Optional)
   - Email address for replies
   - Format: `contact@yourdomain.com`

### How to Set Environment Variables in Bolt Hosting:

1. Go to your project settings in Bolt
2. Look for "Environment Variables" or "Build Settings"
3. Add each variable with its corresponding value
4. Redeploy your application

### Example Values:

```
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL="Institute for AI <onboarding@resend.dev>"
REPLY_TO=contact@yourdomain.com
```

### Testing Email Setup:

Once you've set the environment variables and redeployed:

1. Visit your deployed site
2. Calculate a CO₂ footprint
3. Click "Detaillierten CO₂-Bericht per E-Mail erhalten"
4. Enter your email address
5. Check if the email is sent successfully

### Troubleshooting:

- If you get a 502 error, the environment variables are not set correctly
- If you get a 404 error, the serverless function is not deployed
- Check the browser console for detailed error messages
- Verify your Resend API key is active and has sending permissions

### Free Tier Limits:

Resend free tier includes:
- 3,000 emails per month
- 100 emails per day
- Must verify your sending domain for production use

For development/testing, you can use the default `onboarding@resend.dev` sender.
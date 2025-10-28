# Environment Variables Setup Guide

This guide will help you set up the required environment variables for email validation (Zeru) and phone OTP verification (Twilio).

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Zeruh Email Validation API
# Get your API key from: https://zeruh.com
ZERUH_API_KEY=650aeec183dba9cf14fe5ab40d5e270733d5890b1364c526a210f5c8bb6363aa

# Twilio SMS/OTP Configuration
# Get these from: https://console.twilio.com
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_service_sid_here

# Supabase Configuration
# Get these from: https://supabase.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Companies House API
NEXT_PUBLIC_COMPANIES_HOUSE_API_KEY=your_companies_house_api_key_here
```

## Step-by-Step Setup

### 1. Zeruh Email Validation (Already Configured)

Your Zeruh API key is: `650aeec183dba9cf14fe5ab40d5e270733d5890b1364c526a210f5c8bb6363aa`

Simply add this to your `.env.local` file.

### 2. Twilio Phone OTP Setup

#### Step 1: Create a Twilio Account
1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Sign up for a free account
3. Complete the verification process

#### Step 2: Get Your Account Credentials
1. Log in to the [Twilio Console](https://console.twilio.com)
2. Your **Account SID** and **Auth Token** are displayed on the dashboard
3. Copy these values to your `.env.local` file

#### Step 3: Create a Verify Service
1. In the Twilio Console, navigate to **Verify** → **Services**
2. Click **Create new Verify Service**
3. Give it a name (e.g., "Tally Finance OTP")
4. Click **Create**
5. Copy the **Service SID** and add it to your `.env.local` file as `TWILIO_VERIFY_SERVICE_SID`

#### Step 4: Configure Phone Numbers (Optional for Development)
- Twilio's free trial account includes one phone number
- For production, you'll need to purchase a phone number or use Twilio's Verify API (which handles numbers automatically)

### 3. Supabase Configuration

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project or use an existing one
3. Go to **Settings** → **API**
4. Copy the **Project URL** (use as `NEXT_PUBLIC_SUPABASE_URL`)
5. Copy the **anon/public key** (use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 4. Companies House API (If needed)

1. Go to [https://developer.company-information.service.gov.uk](https://developer.company-information.service.gov.uk)
2. Sign up for an API key
3. Add it to your `.env.local` file

## How It Works

### Email Verification Flow
1. User enters their email in step 2 of the lead capture
2. On "Continue", the email is validated using Zeruh API
3. If valid, user proceeds to phone number step
4. If invalid, an error message is displayed

### Phone OTP Flow
1. User enters their phone number in step 3
2. User clicks "Send Code"
3. Twilio sends a 6-digit OTP s to the phone number
4. User enters the code
5. Code is verified with Twilio
6. If valid, user proceeds to results page
7. If invalid, an error message is displayed

## Testing

To test locally:
1. Create `.env.local` with all the variables above
2. Run `pnpm dev`
3. Navigate to the assessment page
4. Complete the assessment and test the email/phone verification flows

## Troubleshooting

### Email verification not working
- Check that `ZERUH_API_KEY` is set correctly
- Ensure the API key has sufficient credits
- Check browser console for error messages

### OTP not sending
- Verify `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_VERIFY_SERVICE_SID` are correct
- Check Twilio console for account status and credits
- Ensure the phone number is in correct format (Twilio handles +44 for UK numbers)
- Check Twilio console logs for delivery status

### OTP verification failing
- Ensure the code is exactly 6 digits
- Check that the code hasn't expired (default is 10 minutes)
- Verify the phone number matches the one the code was sent to

## Notes

- Never commit `.env.local` to version control
- The `.env.local.example` file shows the structure without sensitive data
- For production, set these variables in your hosting platform's environment settings
- Twilio's free trial has limitations (like requiring verified phone numbers for testing)


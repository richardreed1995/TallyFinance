# OTP Flow Summary

## Assessment Flow with Email & Phone Verification

### 1. Assessment Questions
User completes all assessment questions.

### 2. Qualification Check
The system checks if the user qualifies based on:
- Yes business owner (question 1)
- 12+ months trading (question 3)
- Limited company (question 5)
- Annual turnover over £100k (question 4)

### 3. Lead Capture (Only for Qualified Users)

#### Step 0: Congratulations Screen
- Shows pre-approved loan amount
- User clicks "Get My Quote"

#### Step 1: Name
- User enters full name
- User clicks "Continue"

#### Step 2: Email (with Zeruh validation)
- User enters email address
- User clicks "Continue"
- **Email is validated using Zeruh API**
- Shows "Verifying..." while checking
- If valid: Shows checkmark ✓ and proceeds to phone step
- If invalid: Shows error message

#### Step 3: Phone (with Twilio OTP)

**Phase 1: Enter Phone Number**
- User enters phone number
- User clicks "Send Code"
- **OTP is sent via Twilio Verify API**
- Button shows "Sending..." while processing
- Shows "We sent a 6-digit code to [phone]"

**Phase 2: Enter OTP Code**
- UI switches to show OTP input field
- Large, centered input with lock icon
- User enters 6-digit code
- User clicks "Get My Quote"
- **OTP is verified with Twilio**
- Button shows "Verifying..." while checking
- If valid: Saves all data and routes to `/results/r1`
- If invalid: Shows error message "Invalid verification code"

### 4. Results Page
- All qualified users are routed to `/results/r1`
- Non-qualified users go directly to `/results/r2` (bypassing lead capture)

## Data Flow

### What Gets Saved to Supabase:
1. **Email**: Saved after successful Zeruh validation (step 2)
2. **Assessment answers**: Saved throughout the assessment
3. **Name & Phone**: Saved after successful OTP verification (step 3)
4. **Score & Qualification Status**: Final update on OTP verification

### What Gets Stored in SessionStorage:
- `submissionId`: Created on first save
- `assessmentScore`: Calculated score
- `assessmentAnswers`: All answers
- `isQualified`: Qualification status
- `userEmail`: Email address
- `userName`: Full name
- `userPhone`: Phone number
- `leadData`: Complete lead object with all details

## Environment Variables Required

```env
# Zeruh Email Validation
ZERUH_API_KEY=650aeec183dba9cf14fe5ab40d5e270733d5890b1364c526a210f5c8bb6363aa

# Twilio OTP
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
```

## Key Features

✅ Email validation with Zeruh before proceeding  
✅ Phone OTP sent via Twilio Verify API  
✅ OTP verification required before submission  
✅ Loading states for all async operations  
✅ Error handling and user feedback  
✅ Automatic routing to correct results page  
✅ All data saved to Supabase  
✅ SessionStorage for client-side data persistence  

## Error Handling

- **Invalid Email**: Shows specific error message from Zeruh API
- **Failed OTP Send**: Shows error message, allows retry
- **Invalid OTP**: Shows error message, allows re-entry
- **Network Errors**: Logged to console, user-friendly error displayed

## Testing Checklist

- [ ] Email validation works with Zeruh
- [ ] Invalid emails are rejected
- [ ] OTP is sent successfully via Twilio
- [ ] OTP code input field appears after sending
- [ ] OTP verification succeeds with correct code
- [ ] OTP verification fails with incorrect code
- [ ] User is routed to /results/r1 after successful OTP
- [ ] All data is saved to Supabase
- [ ] Loading states display correctly
- [ ] Error messages display appropriately






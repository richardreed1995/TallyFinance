/**
 * Test script for email notifications
 * This script tests the email notification system with mock data
 * 
 * Usage: node test-email-notification.js
 */

const { Resend } = require('resend')
require('dotenv').config({ path: '.env.local' })

// Helper to generate a random-looking submission ID (e.g., abc123-def456-ghi789)
function generateSubmissionId() {
  const seg = () =>
    Math.random().toString(36).slice(2, 8) // 6 chars [a-z0-9]
  return `${seg()}-${seg()}-${seg()}`
}

// Mock submission data (similar to what would come from Supabase)
const mockQualifiedSubmission = {
  id: 'test-' + Date.now(),
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+44 7700 900123',
  company_name: 'Test Business Ltd',
  company_number: '12345678',
  company_type: 'Limited company',
  question_2_loan_amount: 150000,
  question_3_trading_time: '24+ months',
  question_4_annual_turnover: 500000,
  question_5_company_type: 'Limited company',
  question_6_finance_purpose: 'Business expansion',
  question_7_credit_profile: 'Excellent',
  question_8_homeowner: true,
  score: 85,
  qualification_status: 'qualified'
}

function formatCurrency(amount) {
  if (amount >= 1000000) {
    return `£${(amount / 1000000).toFixed(1)}m`
  } else if (amount >= 1000) {
    return `£${(amount / 1000).toFixed(0)}k`
  }
  return `£${amount}`
}

function formatLoanAmountRange(amount) {
  if (amount < 50000) {
    return '£10k - £50k'
  } else if (amount < 100000) {
    return '£50k - £100k'
  } else if (amount < 250000) {
    return '£100k - £250k'
  } else if (amount < 500000) {
    return '£250k - £500k'
  } else if (amount < 1000000) {
    return '£500k - £1m'
  } else if (amount < 2000000) {
    return '£1m - £2m'
  }
  return formatCurrency(amount)
}

function formatTurnoverRange(turnover) {
  if (turnover < 50000) {
    return 'Under £50k'
  } else if (turnover < 100000) {
    return '£50k - £100k'
  } else if (turnover < 250000) {
    return '£100k - £250k'
  } else if (turnover < 500000) {
    return '£250k - £500k'
  } else if (turnover < 1000000) {
    return '£500k - £1m'
  }
  return '£1m+'
}

function generateLeadNotificationHTML(data) {
  const formatValue = (value, fallback = 'Not provided') => {
    if (value === null || value === undefined) return fallback
    const stringValue = String(value).trim()
    return stringValue.length > 0 ? stringValue : fallback
  }

  const firstName = formatValue(data.fullName || '', 'Lead').split(/\s+/)[0]
  const phoneDisplay = data.phoneNumber ? data.phoneNumber.trim() : undefined
  const phoneHref = phoneDisplay ? phoneDisplay.replace(/[^\d+]/g, '') : ''
  const emailDisplay = data.emailAddress ? data.emailAddress.trim() : undefined

  const loanAmountDisplay =
    data.loanAmountNumeric !== undefined && data.loanAmountNumeric !== null
      ? `£${data.loanAmountNumeric.toLocaleString()}`
      : formatValue(data.loanAmount, 'Not specified')

  const turnoverDisplay =
    data.annualTurnoverNumeric !== undefined && data.annualTurnoverNumeric !== null
      ? `£${data.annualTurnoverNumeric.toLocaleString()}`
      : formatValue(data.annualTurnover, 'Not specified')

  const infoRow = (label, value) => `
          <div class="info-row">
            <span class="info-label">${label}:</span>
            <span class="info-value">${value}</span>
          </div>
        `

  const contactRows = [
    infoRow('Full Name', formatValue(data.fullName)),
    infoRow(
      'Email',
      emailDisplay ? `<a href="mailto:${emailDisplay}">${emailDisplay}</a>` : 'Not provided'
    ),
    infoRow(
      'Phone',
      phoneHref ? `<a href="tel:${phoneHref}">${formatValue(phoneDisplay)}</a>` : 'Not provided'
    )
  ].join('')

  const companyRows = [
    infoRow('Company Name', formatValue(data.companyName)),
    infoRow('Company Number', formatValue(data.companyNumber)),
    infoRow('Registered Address', formatValue(data.registeredAddress))
  ].join('')

  const assessmentRows = [
    infoRow('Loan Amount', loanAmountDisplay),
    infoRow('Trading Duration', formatValue(data.tradingDuration, 'Not specified')),
    infoRow('Annual Turnover', turnoverDisplay),
    infoRow('Loan Purpose', formatValue(data.loanPurpose, 'Not specified')),
    infoRow('Timeline', formatValue(data.timeline, 'Not specified')),
    infoRow('Decision Maker', formatValue(data.decisionMaker, 'Not specified')),
    infoRow('Credit Profile', formatValue(data.creditProfile, 'Not specified')),
    infoRow('Homeowner', formatValue(data.homeowner, 'Not specified'))
  ].join('')

  const ctaContent = phoneHref
    ? `<a href="tel:${phoneHref}" class="cta-button">Call ${firstName}</a>`
    : `<div class="cta-note">Phone number not provided</div>`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Notification</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
      line-height: 1.6;
      color: #0F172A;
      background-color: #F1F5F9;
      padding: 40px 20px;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(to bottom, #ffffff, #F8FAFC);
      padding: 32px 32px 24px;
      text-align: center;
      border-bottom: 1px solid #E2E8F0;
    }
    .logo {
      font-size: 20px;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .header p {
      font-size: 14px;
      color: #64748B;
    }
    .content {
      padding: 32px;
    }
    .cta-section {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin-bottom: 24px;
    }
    .lead-amount {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748B;
      margin-bottom: 8px;
    }
    .amount-value {
      font-size: 36px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 4px;
      letter-spacing: -1px;
    }
    .lead-name {
      font-size: 14px;
      color: #64748B;
      margin-bottom: 20px;
    }
    .cta-button {
      display: inline-block;
      background-color: #2563EB;
      color: #ffffff !important;
      padding: 12px 32px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .cta-button:hover {
      background-color: #1D4ED8;
    }
    .cta-note {
      font-size: 13px;
      color: #94A3B8;
    }
    .info-section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 12px;
      letter-spacing: -0.3px;
    }
    .info-card {
      background-color: #ffffff;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 16px;
    }
    .info-row {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 10px 0;
      border-bottom: 1px solid #F1F5F9;
      gap: 8px;
    }
    .info-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .info-row:first-child {
      padding-top: 0;
    }
    .info-label {
      font-size: 13px;
      color: #64748B;
      font-weight: 500;
      flex: 0 0 auto;
      margin-right: 6px;
    }
    .info-value {
      font-size: 13px;
      color: #0F172A;
      font-weight: 500;
      text-align: left;
      max-width: 100%;
      flex: 1 1 auto;
    }
    .info-value a {
      color: #2563EB;
      text-decoration: none;
    }
    .info-value a:hover {
      text-decoration: underline;
    }
    .footer {
      background-color: #F8FAFC;
      padding: 24px 32px;
      border-top: 1px solid #E2E8F0;
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      color: #64748B;
      margin-bottom: 8px;
    }
    .footer a {
      color: #2563EB;
      text-decoration: none;
      font-weight: 500;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .submission-id {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      color: #64748B;
      margin-top: 12px;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 20px 12px;
      }
      .content, .header {
        padding: 24px 20px;
      }
      .amount-value {
        font-size: 28px;
      }
      .info-row {
        flex-direction: column;
        gap: 4px;
      }
      .info-value {
        text-align: left;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <div class="logo">Sendlead</div>
      <h1>New Lead Notification</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- CTA Section with Call Button -->
      <div class="cta-section">
        <div class="lead-amount">Loan Amount Requested</div>
        <div class="amount-value">${loanAmountDisplay}</div>
        <div class="lead-name">${formatValue(data.fullName, 'Qualified lead')}</div>
        ${ctaContent}
      </div>

      <!-- Contact Information -->
      <div class="info-section">
        <div class="section-title">Contact Information</div>
        <div class="info-card">
          ${contactRows}
        </div>
      </div>

      <!-- Company Information -->
      <div class="info-section">
        <div class="section-title">Company Information</div>
        <div class="info-card">
          ${companyRows}
        </div>
      </div>

      <!-- Assessment Summary -->
      <div class="info-section">
        <div class="section-title">Assessment Summary</div>
        <div class="info-card">
          ${assessmentRows}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Questions? Contact <a href="mailto:partners@sendlead.co">partners@sendlead.co</a></p>
      <div class="submission-id">Submission ID: ${formatValue(data.submissionId)}</div>
      <p style="margin-top: 12px;">© ${new Date().getFullYear()} Sendlead. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

async function testEmailNotification() {
  console.log('🧪 Testing Email Notification System\n')
  
  // Check environment variables
  console.log('📋 Checking environment variables...')
  const apiKey = process.env.RESEND_API_KEY
  const recipientEmail = process.env.RESEND_LEAD_NOTIFICATION_EMAIL
  const bccEmail = process.env.RESEND_LEAD_NOTIFICATION_BCC
  const senderEmail = process.env.RESEND_LEAD_NOTIFICATION_SENDER
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not found in .env.local')
    process.exit(1)
  }
  console.log('✅ RESEND_API_KEY found')
  
  if (!recipientEmail) {
    console.error('❌ RESEND_LEAD_NOTIFICATION_EMAIL not found in .env.local')
    process.exit(1)
  }
  console.log('✅ RESEND_LEAD_NOTIFICATION_EMAIL found:', recipientEmail)

  if (!bccEmail) {
    console.error('❌ RESEND_LEAD_NOTIFICATION_BCC not found in .env.local')
    process.exit(1)
  }
  console.log('✅ RESEND_LEAD_NOTIFICATION_BCC found:', bccEmail)
  
  if (!senderEmail) {
    console.error('❌ RESEND_LEAD_NOTIFICATION_SENDER not found in .env.local')
    process.exit(1)
  }
  console.log('✅ RESEND_LEAD_NOTIFICATION_SENDER found:', senderEmail)
  
  // Prepare email data
  console.log('\n📧 Preparing test email...')
  const fullName = [mockQualifiedSubmission.first_name, mockQualifiedSubmission.last_name].join(' ')
  const submissionId = generateSubmissionId()
  
  const emailData = {
    submissionId,
    fullName,
    emailAddress: mockQualifiedSubmission.email,
    phoneNumber: mockQualifiedSubmission.phone,
    companyName: mockQualifiedSubmission.company_name,
    companyNumber: mockQualifiedSubmission.company_number,
    companyType: mockQualifiedSubmission.company_type,
    registeredAddress: '123 Business Street, London, SW1A 1AA',
    loanAmount: formatLoanAmountRange(mockQualifiedSubmission.question_2_loan_amount),
    loanAmountNumeric: mockQualifiedSubmission.question_2_loan_amount,
    tradingDuration: mockQualifiedSubmission.question_3_trading_time,
    annualTurnover: formatTurnoverRange(mockQualifiedSubmission.question_4_annual_turnover),
    annualTurnoverNumeric: mockQualifiedSubmission.question_4_annual_turnover,
    loanPurpose: mockQualifiedSubmission.question_6_finance_purpose,
    timeline: 'Within 3 months',
    decisionMaker: 'Director',
    creditProfile: mockQualifiedSubmission.question_7_credit_profile,
    homeowner: mockQualifiedSubmission.question_8_homeowner ? 'Yes' : 'No',
    score: mockQualifiedSubmission.score,
    qualificationStatus: 'QUALIFIED'
  }
  
  console.log('Lead Details:', {
    name: fullName,
    email: emailData.emailAddress,
    phone: emailData.phoneNumber,
    loanAmount: emailData.loanAmount,
    score: emailData.score
  })
  
  // Generate HTML
  const html = generateLeadNotificationHTML(emailData)
  
  // Send email
  console.log('\n📤 Sending test email via Resend...')
  try {
    const resend = new Resend(apiKey)
    
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: recipientEmail,
      bcc: [bccEmail],
      subject: `🧪 TEST: New Qualified Lead - ${fullName} - ${emailData.loanAmount}`,
      html: html,
    })
    
    if (error) {
      console.error('❌ Failed to send email:', error)
      process.exit(1)
    }
    
    console.log('✅ Email sent successfully!')
    console.log('📬 Email ID:', data.id)
    console.log('\n✨ Check your inbox at:', recipientEmail)
    console.log('💡 Note: Check spam folder if you don\'t see it in a few minutes')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Run the test
testEmailNotification()


/**
 * Test script for Sendlead webhook integration
 * Run with: node test-sendlead-integration.js
 */

require('dotenv').config({ path: '.env.local' })

const testPayload = {
  // Required: Campaign authentication
  campaign_token: process.env.SENDLEAD_CAMPAIGN_TOKEN,

  // Required: Contact information
  name: "Test Business Owner",
  email: "test@example.com",
  phone: "07700900123",
  postcode: "SW1A 1AA",

  // Business loan specific fields
  loan_amount: 75000,
  annual_turnover: 300000,
  company_type: "Limited company",
  trading_time: "24+ months",
  credit_profile: "Good",
  homeowner: true,
  business_owner: true,
  finance_purpose: "Business expansion",
  consent_given: true,

  // Source tracking
  source: "tally",
  industry: "business_loan",

  // Companies House data (example)
  company_number: "12345678",
  company_name: "Test Company Ltd",
  company_status: "active",
  company_address: "123 Test Street, London, SW1A 1AA, England",

  // Additional metadata
  answers: {
    director_role: "Director",
    score: 85,
    qualification_status: "qualified",
  },
}

async function testSendleadIntegration() {
  console.log('🧪 Testing Sendlead Integration\n')
  console.log('Configuration:')
  console.log('  Webhook URL:', process.env.SENDLEAD_WEBHOOK_URL || '❌ NOT SET')
  console.log('  Campaign Token:', process.env.SENDLEAD_CAMPAIGN_TOKEN ? '✅ SET' : '❌ NOT SET')
  console.log('')

  if (!process.env.SENDLEAD_WEBHOOK_URL) {
    console.error('❌ SENDLEAD_WEBHOOK_URL is not set in .env.local')
    process.exit(1)
  }

  if (!process.env.SENDLEAD_CAMPAIGN_TOKEN || process.env.SENDLEAD_CAMPAIGN_TOKEN === 'YOUR_WEBHOOK_TOKEN_HERE') {
    console.error('❌ SENDLEAD_CAMPAIGN_TOKEN is not set in .env.local')
    console.error('   Please replace YOUR_WEBHOOK_TOKEN_HERE with your actual campaign token')
    process.exit(1)
  }

  console.log('📤 Sending test lead to Sendlead...\n')
  console.log('Payload:', JSON.stringify(testPayload, null, 2))
  console.log('')

  try {
    const response = await fetch(process.env.SENDLEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TallyFinance/Test',
      },
      body: JSON.stringify(testPayload),
    })

    console.log('Response Status:', response.status, response.statusText)
    console.log('')

    const result = await response.json()

    if (response.ok) {
      console.log('✅ SUCCESS! Lead sent to Sendlead')
      console.log('')
      console.log('Response:', JSON.stringify(result, null, 2))
      console.log('')

      if (result.lead_id) {
        console.log('🎉 Lead ID:', result.lead_id)
      }
      if (result.request_id) {
        console.log('📝 Request ID:', result.request_id)
      }
      if (result.distribution?.organisationName) {
        console.log('🏢 Distributed to:', result.distribution.organisationName)
      }
    } else {
      console.log('❌ FAILED! Sendlead returned an error')
      console.log('')
      console.log('Error Response:', JSON.stringify(result, null, 2))
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ FAILED! Error sending to Sendlead:')
    console.error(error.message)
    process.exit(1)
  }
}

testSendleadIntegration()

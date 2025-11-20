"use server"

import { Resend } from 'resend'
import { generateLeadNotificationHTML, type LeadEmailData } from '@/lib/email-template'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface AssessmentSubmission {
  id: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  company_name?: string
  company_number?: string
  company_type?: string
  company_address?: {
    address_line_1?: string
    address_line_2?: string
    locality?: string
    postal_code?: string
    country?: string
  }
  director_role?: string
  question_2_loan_amount?: number
  question_3_trading_time?: string
  question_4_annual_turnover?: number
  question_5_company_type?: string
  question_6_finance_purpose?: string
  question_7_credit_profile?: string
  question_8_homeowner?: boolean
  score?: number
  qualification_status?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  click_id?: string
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `£${(amount / 1000000).toFixed(1)}m`
  } else if (amount >= 1000) {
    return `£${(amount / 1000).toFixed(0)}k`
  }
  return `£${amount}`
}

function formatLoanAmountRange(amount: number): string {
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

function formatTurnoverRange(turnover: number): string {
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

export async function sendLeadNotificationEmail(submission: AssessmentSubmission) {
  try {
    // Check if email notifications are enabled
    const emailNotificationsEnabled = process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true'
    if (!emailNotificationsEnabled) {
      console.log('[Lead Notification] Email notifications disabled - skipping')
      return { success: true, skipped: true }
    }

    // Only send emails for qualified leads
    if (submission.qualification_status !== 'qualified') {
      console.log('[Lead Notification] Skipping email - lead not qualified')
      return { success: true, skipped: true }
    }

    // Check if required environment variables are set
    if (!process.env.RESEND_API_KEY) {
      console.error('[Lead Notification] RESEND_API_KEY not configured')
      return { success: false, error: 'Email service not configured' }
    }

    if (!process.env.RESEND_LEAD_NOTIFICATION_EMAIL) {
      console.error('[Lead Notification] RESEND_LEAD_NOTIFICATION_EMAIL not configured')
      return { success: false, error: 'Notification email not configured' }
    }

    const fullName = [submission.first_name, submission.last_name].filter(Boolean).join(' ') || 'Unknown'
    
    // Format company address if available
    let registeredAddress = ''
    if (submission.company_address) {
      const addr = submission.company_address
      const addressParts = [
        addr.address_line_1,
        addr.address_line_2,
        addr.locality,
        addr.postal_code,
        addr.country
      ].filter(Boolean)
      registeredAddress = addressParts.join(', ')
    }
    
    const emailData: LeadEmailData = {
      submissionId: submission.id,
      fullName,
      emailAddress: submission.email,
      phoneNumber: submission.phone || 'Not provided',
      companyName: submission.company_name,
      companyNumber: submission.company_number,
      companyType: submission.company_type || submission.question_5_company_type,
      registeredAddress: registeredAddress || undefined,
      loanAmount: submission.question_2_loan_amount 
        ? formatLoanAmountRange(submission.question_2_loan_amount)
        : 'Not specified',
      loanAmountNumeric: submission.question_2_loan_amount,
      tradingDuration: submission.question_3_trading_time || 'Not specified',
      annualTurnover: submission.question_4_annual_turnover 
        ? formatTurnoverRange(submission.question_4_annual_turnover)
        : 'Not specified',
      annualTurnoverNumeric: submission.question_4_annual_turnover,
      loanPurpose: submission.question_6_finance_purpose || 'Not specified',
      timeline: 'Within 3 months', // Default timeline
      decisionMaker: submission.director_role || 'Director',
      creditProfile: submission.question_7_credit_profile || 'Not specified',
      homeowner: submission.question_8_homeowner ? 'Yes' : 'No',
      score: submission.score || 0,
      qualificationStatus: 'QUALIFIED'
    }

    const html = generateLeadNotificationHTML(emailData)

    const senderEmail = process.env.RESEND_LEAD_NOTIFICATION_SENDER || 'SendLead <noreply@notification.sendlead.co>'
    const recipientEmail = process.env.RESEND_LEAD_NOTIFICATION_EMAIL

    console.log('[Lead Notification] Sending email to:', recipientEmail)
    console.log('[Lead Notification] Lead details:', { fullName, email: submission.email, phone: submission.phone })

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: recipientEmail,
      subject: `🎉 New Qualified Lead: ${fullName} - ${emailData.loanAmount}`,
      html: html,
    })

    if (error) {
      console.error('[Lead Notification] Failed to send email:', error)
      return { success: false, error: error.message }
    }

    console.log('[Lead Notification] Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('[Lead Notification] Error sending email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}


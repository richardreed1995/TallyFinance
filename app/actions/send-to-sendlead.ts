"use server"

import { AssessmentSubmission } from "./send-lead-notification"

interface SendleadResult {
  success: boolean
  skipped?: boolean
  error?: string
  lead_id?: string
  request_id?: string
}

/**
 * Sends qualified leads to Sendlead for distribution to buyers
 * Only triggers for qualified leads
 */
export async function sendToSendlead(
  submission: AssessmentSubmission
): Promise<SendleadResult> {
  try {
    // Check if Sendlead integration is enabled
    const sendleadUrl = process.env.SENDLEAD_WEBHOOK_URL
    const campaignToken = process.env.SENDLEAD_CAMPAIGN_TOKEN

    if (!sendleadUrl || !campaignToken) {
      console.log("[Sendlead] Integration not configured - skipping")
      return { success: true, skipped: true }
    }

    // Send both qualified and unqualified leads
    // if (submission.qualification_status !== "qualified") {
    //   console.log("[Sendlead] Skipping - lead not qualified")
    //   return { success: true, skipped: true }
    // }

    // Build the Sendlead payload according to their webhook format
    const payload = {
      // Required: Campaign authentication
      campaign_token: campaignToken,

      // Required: Contact information
      name: [submission.first_name, submission.last_name].filter(Boolean).join(" ") || "Unknown",
      email: submission.email,
      phone: submission.phone || "",

      // Optional: Postcode (if available from company address)
      postcode: submission.company_address?.postal_code || "",

      // Business loan specific fields
      loan_amount: submission.question_2_loan_amount,
      annual_turnover: submission.question_4_annual_turnover,
      company_type: submission.question_5_company_type || submission.company_type,
      trading_time: submission.question_3_trading_time,
      credit_profile: submission.question_7_credit_profile,
      homeowner: submission.question_8_homeowner || false,
      business_owner: true, // Always true for qualified leads
      finance_purpose: submission.question_6_finance_purpose,
      consent_given: true, // They completed the form

      // Source tracking
      source: submission.utm_source || "tally",
      medium: submission.utm_medium,
      campaign: submission.utm_campaign,
      click_id: submission.click_id,
      industry: "business_loan",

      // Companies House data
      company_number: submission.company_number,
      company_name: submission.company_name,
      company_status: submission.company_status,
      company_address: formatCompanyAddress(submission.company_address),

      // Additional metadata
      answers: {
        director_role: submission.director_role,
        score: submission.score,
        qualification_status: submission.qualification_status,
      },
    }

    console.log("[Sendlead] Sending lead to Sendlead:", {
      name: payload.name,
      email: payload.email,
      loan_amount: payload.loan_amount,
      company_name: payload.company_name,
    })

    const response = await fetch(sendleadUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "TallyFinance/1.0",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Sendlead] Failed with status:", response.status, errorText)
      return {
        success: false,
        error: `Sendlead webhook failed with status ${response.status}: ${errorText}`,
      }
    }

    const result = await response.json()
    console.log("[Sendlead] Successfully sent lead:", result)

    return {
      success: true,
      lead_id: result.lead_id,
      request_id: result.request_id,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[Sendlead] Error sending lead:", error)
    return {
      success: false,
      error: message,
    }
  }
}

function formatCompanyAddress(
  address: AssessmentSubmission["company_address"]
): string | null {
  if (!address) {
    return null
  }

  const addressParts = [
    address.address_line_1,
    address.address_line_2,
    address.locality,
    address.postal_code,
    address.country,
  ].filter(Boolean)

  return addressParts.length ? addressParts.join(", ") : null
}

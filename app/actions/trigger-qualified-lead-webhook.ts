"use server"

import { AssessmentSubmission } from "./send-lead-notification"

interface WebhookResult {
  success: boolean
  skipped?: boolean
  error?: string
  status?: number
}

export async function triggerQualifiedLeadWebhook(
  submission: AssessmentSubmission
): Promise<WebhookResult> {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL

  if (!webhookUrl) {
    console.error("[Lead Webhook] MAKE_WEBHOOK_URL not configured")
    return { success: false, error: "Webhook URL not configured" }
  }

  if (submission.qualification_status !== "qualified") {
    console.log("[Lead Webhook] Skipping webhook - lead not qualified")
    return { success: true, skipped: true }
  }

  const payload = {
    meta: {
      triggered_at: new Date().toISOString(),
      source: "assessment_funnel",
    },
    submission,
    derived: {
      full_name: [submission.first_name, submission.last_name]
        .filter(Boolean)
        .join(" ") || null,
      registered_address: formatCompanyAddress(submission.company_address),
    },
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    if (!response.ok) {
      const message = `[Lead Webhook] Failed with status ${response.status}`
      console.error(message)
      return { success: false, status: response.status, error: message }
    }

    console.log("[Lead Webhook] Successfully fired webhook")
    return { success: true, status: response.status }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook error"
    console.error("[Lead Webhook] Error firing webhook:", error)
    return { success: false, error: message }
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



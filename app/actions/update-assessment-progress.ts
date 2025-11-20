"use server"

import { createClient } from "@/lib/supabase/server"
import { type AssessmentSubmission } from "./send-lead-notification"
import { triggerQualifiedLeadWebhook } from "./trigger-qualified-lead-webhook"
import { sendToSendlead } from "./send-to-sendlead"

export interface ProgressUpdate {
  submissionId?: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  consentGiven?: boolean
  
  // Assessment question answers (in exact order)
  question1BusinessOwner?: boolean
  question2LoanAmount?: number
  question3TradingTime?: string
  question4AnnualTurnover?: number
  question5CompanyType?: string
  question6FinancePurpose?: string
  question7CreditProfile?: string
  question8Homeowner?: boolean
  
  // Progress tracking
  currentQuestion?: number
  answers?: Record<number, number[]>
  questionsAnswered?: number[]
  isCompleted?: boolean
  
  // Results
  score?: number
  qualificationStatus?: "qualified" | "not-qualified"
  
  // Company details (if applicable)
  companyNumber?: string
  companyName?: string
  companyStatus?: string
  companyType?: string
  companyIncorporationDate?: string
  companyAddress?: any
  companySicCodes?: string[]
  
  // Additional company information
  companyDescription?: string
  companyPreviousNames?: any
  companyJurisdiction?: string
  companyTypeFull?: string
  companyHasBeenLiquidated?: boolean
  companyHasInsolvencyHistory?: boolean
  companyOfficers?: any
  
  // Director information
  directorName?: string
  directorRole?: string
  directorAppointedDate?: string
  directorNationality?: string
  directorOccupation?: string
  
  // Tracking information
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  clickId?: string
}

export async function updateAssessmentProgress(data: ProgressUpdate) {
  try {
    console.log("[v0] updateAssessmentProgress called with:", data)
    const supabase = await createClient()

    // Prepare update data object, only including defined values
    const updateData: any = {}
    
    if (data.email !== undefined) updateData.email = data.email
    if (data.firstName !== undefined) updateData.first_name = data.firstName
    if (data.lastName !== undefined) updateData.last_name = data.lastName
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.consentGiven !== undefined) updateData.consent_given = data.consentGiven
    
    // Assessment answers (in exact question order)
    if (data.question1BusinessOwner !== undefined) updateData.business_owner = data.question1BusinessOwner
    if (data.question2LoanAmount !== undefined) updateData.loan_amount = data.question2LoanAmount
    if (data.question3TradingTime !== undefined) updateData.trading_time = data.question3TradingTime
    if (data.question4AnnualTurnover !== undefined) updateData.annual_turnover = data.question4AnnualTurnover
    if (data.question5CompanyType !== undefined) updateData.company_type = data.question5CompanyType
    if (data.question6FinancePurpose !== undefined) updateData.finance_purpose = data.question6FinancePurpose
    if (data.question7CreditProfile !== undefined) updateData.credit_profile = data.question7CreditProfile
    if (data.question8Homeowner !== undefined) updateData.homeowner = data.question8Homeowner
    
    // Progress tracking
    if (data.currentQuestion !== undefined) updateData.current_question = data.currentQuestion
    if (data.answers !== undefined) updateData.answers = data.answers
    if (data.questionsAnswered !== undefined) updateData.questions_answered = data.questionsAnswered
    if (data.isCompleted !== undefined) updateData.is_completed = data.isCompleted
    
    // Results
    if (data.score !== undefined) updateData.score = data.score
    if (data.qualificationStatus !== undefined) updateData.qualification_status = data.qualificationStatus
    
    // Company details
    if (data.companyNumber !== undefined) updateData.company_number = data.companyNumber
    if (data.companyName !== undefined) updateData.company_name = data.companyName
    if (data.companyStatus !== undefined) updateData.company_status = data.companyStatus
    if (data.companyIncorporationDate !== undefined) updateData.company_incorporation_date = data.companyIncorporationDate
    if (data.companyAddress !== undefined) updateData.company_address = data.companyAddress
    if (data.companySicCodes !== undefined) updateData.company_sic_codes = data.companySicCodes
    
    // Additional company information
    if (data.companyDescription !== undefined) updateData.company_description = data.companyDescription
    if (data.companyPreviousNames !== undefined) updateData.company_previous_names = data.companyPreviousNames
    if (data.companyJurisdiction !== undefined) updateData.company_jurisdiction = data.companyJurisdiction
    if (data.companyTypeFull !== undefined) updateData.company_company_type_full = data.companyTypeFull
    if (data.companyHasBeenLiquidated !== undefined) updateData.company_has_been_liquidated = data.companyHasBeenLiquidated
    if (data.companyHasInsolvencyHistory !== undefined) updateData.company_has_insolvency_history = data.companyHasInsolvencyHistory
    if (data.companyOfficers !== undefined) updateData.company_officers = data.companyOfficers
    
    // Director information
    if (data.directorName !== undefined) updateData.director_name = data.directorName
    if (data.directorRole !== undefined) updateData.director_role = data.directorRole
    if (data.directorAppointedDate !== undefined) updateData.director_appointed_date = data.directorAppointedDate
    if (data.directorNationality !== undefined) updateData.director_nationality = data.directorNationality
    if (data.directorOccupation !== undefined) updateData.director_occupation = data.directorOccupation

    // Tracking information
    if (data.utmSource !== undefined) updateData.utm_source = data.utmSource
    if (data.utmMedium !== undefined) updateData.utm_medium = data.utmMedium
    if (data.utmCampaign !== undefined) updateData.utm_campaign = data.utmCampaign
    if (data.utmTerm !== undefined) updateData.utm_term = data.utmTerm
    if (data.utmContent !== undefined) updateData.utm_content = data.utmContent
    if (data.clickId !== undefined) updateData.click_id = data.clickId

    if (data.submissionId) {
      // Check if already completed to prevent duplicate webhooks
      let wasAlreadyCompleted = false
      try {
        const { data: existing } = await supabase
          .from("assessment_submissions")
          .select("is_completed")
          .eq("id", data.submissionId)
          .single()
        
        if (existing && existing.is_completed) {
          wasAlreadyCompleted = true
          console.log("[v0] Assessment already completed, skipping duplicate webhook trigger")
        }
      } catch (err) {
        // Ignore error, assume not completed if fetch fails
      }

      // Update existing submission
      console.log("[v0] Updating existing submission with data:", updateData)
      const updateResult = await performAssessmentMutation({
        supabase,
        mode: "update",
        payload: updateData,
        submissionId: data.submissionId,
      })

      if (!updateResult.success || !updateResult.data) {
        return updateResult
      }

      console.log("[v0] Successfully updated assessment:", updateResult.data)
      
      // Only fire webhook if it's marked completed AND it wasn't already completed
      if (data.isCompleted === true && !wasAlreadyCompleted) {
        await handleLeadSideEffects(updateResult.data, data.qualificationStatus)
      }
      
      return { success: true, data: updateResult.data }
    } else {
      // Create new submission
      console.log("[v0] Creating new submission with data:", updateData)
      const insertResult = await performAssessmentMutation({
        supabase,
        mode: "insert",
        payload: updateData,
      })

      if (!insertResult.success || !insertResult.data) {
        return insertResult
      }

      console.log("[v0] Successfully created assessment:", insertResult.data)
      
      if (data.isCompleted === true) {
        await handleLeadSideEffects(insertResult.data, data.qualificationStatus)
      }
      
      return { success: true, data: insertResult.data }
    }
  } catch (error) {
    console.error("[v0] Failed to update assessment progress:", error)
    return {
      success: false,
      error:
        error && typeof error === "object" && "message" in error && typeof error.message === "string"
          ? error.message
          : "Failed to update assessment",
      details:
        error && typeof error === "object" && "details" in error ? (error as any).details : undefined,
      hint: error && typeof error === "object" && "hint" in error ? (error as any).hint : undefined,
      code: error && typeof error === "object" && "code" in error ? (error as any).code : undefined,
    }
  }
}

type MutationMode = "insert" | "update"

interface MutationOptions {
  supabase: Awaited<ReturnType<typeof createClient>>
  mode: MutationMode
  payload: Record<string, any>
  submissionId?: string
}

async function performAssessmentMutation(options: MutationOptions) {
  const { supabase, mode, payload, submissionId } = options

  const mutation = await executeMutation({
    supabase,
    mode,
    payload,
    submissionId,
  })

  if (!mutation.error) {
    return {
      success: true as const,
      data: normalizeSubmissionRecord(mutation.data),
    }
  }

  console.error("[v0] Assessment mutation failed:", mutation.error)
  console.error("[v0] Payload that failed:", payload)

  if (shouldFallbackToQuestionOrderSchema(mutation.error)) {
    console.warn(
      "[v0] Detected question-order assessment schema. Retrying mutation with question_# column names."
    )

    const questionOrderPayload = mapToQuestionOrderColumns(payload)
    const questionOrderMutation = await executeMutation({
      supabase,
      mode,
      payload: questionOrderPayload,
      submissionId,
    })

    if (!questionOrderMutation.error) {
      console.log("[v0] Question-order schema mutation succeeded")
      return {
        success: true as const,
        data: normalizeSubmissionRecord(questionOrderMutation.data),
      }
    }

    console.error("[v0] Question-order schema mutation also failed:", questionOrderMutation.error)
    console.error("[v0] Question-order payload that failed:", questionOrderPayload)
    return formatMutationFailure(questionOrderMutation.error)
  }

  return formatMutationFailure(mutation.error)
}

interface ExecuteMutationOptions {
  supabase: Awaited<ReturnType<typeof createClient>>
  mode: MutationMode
  payload: Record<string, any>
  submissionId?: string
}

async function executeMutation(options: ExecuteMutationOptions) {
  const { supabase, mode, payload, submissionId } = options

  if (mode === "update" && submissionId) {
    return supabase
      .from("assessment_submissions")
      .update(payload)
      .eq("id", submissionId)
      .select()
      .single()
  }

  return supabase.from("assessment_submissions").insert(payload).select().single()
}

function shouldFallbackToQuestionOrderSchema(error: any): boolean {
  if (!error) {
    return false
  }

  const message = typeof error.message === "string" ? error.message.toLowerCase() : ""

  return (
    error.code === "PGRST204" ||
    (error.code === "42703" && message.includes("column")) ||
    message.includes("business_owner")
  )
}

function mapToQuestionOrderColumns(payload: Record<string, any>) {
  const questionOrderPayload = { ...payload }

  const mappings: Record<string, string> = {
    business_owner: "question_1_business_owner",
    loan_amount: "question_2_loan_amount",
    trading_time: "question_3_trading_time",
    annual_turnover: "question_4_annual_turnover",
    company_type: "question_5_company_type",
    finance_purpose: "question_6_finance_purpose",
    credit_profile: "question_7_credit_profile",
    homeowner: "question_8_homeowner",
  }

  for (const [legacyKey, newKey] of Object.entries(mappings)) {
    if (questionOrderPayload[legacyKey] !== undefined) {
      questionOrderPayload[newKey] = questionOrderPayload[legacyKey]
      delete questionOrderPayload[legacyKey]
    }
  }

  return questionOrderPayload
}

function formatMutationFailure(error: any) {
  return {
    success: false as const,
    error: error?.message ?? "Failed to persist assessment",
    details: error?.details,
    hint: error?.hint,
    code: error?.code,
  }
}

function normalizeSubmissionRecord<T extends Record<string, any> | null>(
  record: T
): T {
  if (!record || typeof record !== "object") {
    return record
  }

  const normalized = { ...record }

  const mappings: Record<string, string> = {
    question_1_business_owner: "business_owner",
    question_2_loan_amount: "loan_amount",
    question_3_trading_time: "trading_time",
    question_4_annual_turnover: "annual_turnover",
    question_5_company_type: "company_type",
    question_6_finance_purpose: "finance_purpose",
    question_7_credit_profile: "credit_profile",
    question_8_homeowner: "homeowner",
  }

  for (const [newKey, legacyKey] of Object.entries(mappings)) {
    if (normalized[newKey] === undefined && normalized[legacyKey] !== undefined) {
      normalized[newKey] = normalized[legacyKey]
    }
  }

  return normalized as T
}


async function handleLeadSideEffects(
  submission: AssessmentSubmission,
  qualificationStatus?: string
) {
  const effectiveStatus =
    qualificationStatus ??
    submission.qualification_status ??
    (submission as any)?.qualificationStatus

  console.log(`[v0] Processing side effects for lead (Status: ${effectiveStatus})`)

  // Send to Sendlead (primary integration - handles email notifications internally)
  // Now sends both qualified and unqualified leads
  const sendleadResult = await sendToSendlead(submission)
  if (!sendleadResult.success && !sendleadResult.skipped) {
    console.error("[v0] Failed to send to Sendlead:", sendleadResult.error)
  } else if (sendleadResult.success && !sendleadResult.skipped) {
    console.log("[v0] Successfully sent to Sendlead - Lead ID:", sendleadResult.lead_id)
  }

  // Make.com webhook (kept as backup)
  // Note: triggerQualifiedLeadWebhook still checks for "qualified" status internally
  const webhookResult = await triggerQualifiedLeadWebhook(submission)
  if (!webhookResult.success && !webhookResult.skipped) {
    console.error("[v0] Failed to trigger lead webhook:", webhookResult.error)
  } else if (webhookResult.success && !webhookResult.skipped) {
    console.log("[v0] Lead webhook triggered successfully")
  }
}

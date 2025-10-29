"use server"

import { createClient } from "@/lib/supabase/server"

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
    if (data.question1BusinessOwner !== undefined) updateData.question_1_business_owner = data.question1BusinessOwner
    if (data.question2LoanAmount !== undefined) updateData.question_2_loan_amount = data.question2LoanAmount
    if (data.question3TradingTime !== undefined) updateData.question_3_trading_time = data.question3TradingTime
    if (data.question4AnnualTurnover !== undefined) updateData.question_4_annual_turnover = data.question4AnnualTurnover
    if (data.question5CompanyType !== undefined) updateData.question_5_company_type = data.question5CompanyType
    if (data.question6FinancePurpose !== undefined) updateData.question_6_finance_purpose = data.question6FinancePurpose
    if (data.question7CreditProfile !== undefined) updateData.question_7_credit_profile = data.question7CreditProfile
    if (data.question8Homeowner !== undefined) updateData.question_8_homeowner = data.question8Homeowner
    
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

    if (data.submissionId) {
      // Update existing submission
      console.log("[v0] Updating existing submission with data:", updateData)
      const { data: submission, error } = await supabase
        .from("assessment_submissions")
        .update(updateData)
        .eq("id", data.submissionId)
        .select()
        .single()

      if (error) {
        console.error("[v0] Error updating assessment:", error)
        console.error("[v0] Update data that failed:", updateData)
        throw error
      }

      console.log("[v0] Successfully updated assessment:", submission)
      return { success: true, data: submission }
    } else {
      // Create new submission
      console.log("[v0] Creating new submission with data:", updateData)
      const { data: submission, error } = await supabase
        .from("assessment_submissions")
        .insert(updateData)
        .select()
        .single()

      if (error) {
        console.error("[v0] Error creating assessment:", error)
        console.error("[v0] Insert data that failed:", updateData)
        throw error
      }

      console.log("[v0] Successfully created assessment:", submission)
      return { success: true, data: submission }
    }
  } catch (error) {
    console.error("[v0] Failed to update assessment progress:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update assessment",
    }
  }
}

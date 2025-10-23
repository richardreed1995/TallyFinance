"use server"

import { createClient } from "@/lib/supabase/server"

export interface AssessmentData {
  // Lead information
  firstName?: string
  lastName?: string
  email: string
  mobile?: string
  consent?: boolean

  // Assessment answers
  ageRange?: string
  netWorth?: string
  investmentPortfolio?: string
  primaryGoal?: string
  taxStrategy?: string
  estatePlan?: string
  feeStructure?: string
  riskTolerance?: string
  diversification?: string
  rebalancing?: string
  financialAdvisor?: string
  advisorCommunication?: string
  investmentPerformance?: string

  // Results
  score?: number
  qualificationStatus?: "qualified" | "not-qualified"
}

export async function submitAssessment(data: AssessmentData) {
  try {
    const supabase = await createClient()

    const { data: submission, error } = await supabase
      .from("assessment_submissions")
      .insert({
        first_name: data.firstName || null,
        last_name: data.lastName || null,
        email: data.email,
        phone: data.mobile || null,
        consent_given: data.consent || false,
        age_range: data.ageRange,
        net_worth: data.netWorth,
        investment_portfolio: data.investmentPortfolio,
        primary_goal: data.primaryGoal,
        tax_strategy: data.taxStrategy,
        estate_plan: data.estatePlan,
        fee_structure: data.feeStructure,
        risk_tolerance: data.riskTolerance,
        diversification: data.diversification,
        rebalancing: data.rebalancing,
        financial_advisor: data.financialAdvisor,
        advisor_communication: data.advisorCommunication,
        investment_performance: data.investmentPerformance,
        score: data.score,
        qualification_status: data.qualificationStatus,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error submitting assessment:", error)
      throw error
    }

    return { success: true, data: submission }
  } catch (error) {
    console.error("[v0] Failed to submit assessment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit assessment",
    }
  }
}

"use server"

import { createClient } from "@/lib/supabase/server"

export interface ProgressUpdate {
  submissionId?: string
  email?: string
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
  score?: number
  qualificationStatus?: "qualified" | "not-qualified"
}

export async function updateAssessmentProgress(data: ProgressUpdate) {
  try {
    console.log("[v0] updateAssessmentProgress called with:", data)
    const supabase = await createClient()

    if (data.submissionId) {
      // Update existing submission
      const { data: submission, error } = await supabase
        .from("assessment_submissions")
        .update({
          email: data.email,
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
        .eq("id", data.submissionId)
        .select()
        .single()

      if (error) {
        console.error("[v0] Error updating assessment:", error)
        throw error
      }

      console.log("[v0] Successfully updated assessment:", submission)
      return { success: true, data: submission }
    } else {
      // Create new submission
      const { data: submission, error } = await supabase
        .from("assessment_submissions")
        .insert({
          email: data.email,
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
        console.error("[v0] Error creating assessment:", error)
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

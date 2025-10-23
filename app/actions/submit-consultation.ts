"use server"

import { createClient } from "@/lib/supabase/server"

interface ConsultationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  wealthManagerStatus: string
  primaryGoal: string
  timeline: string
  biggestChallenge: string
  investableAssets: string
  qualified: boolean
  hotLead: boolean
  score: number
}

export async function submitConsultation(data: ConsultationData) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("consultation_submissions").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      wealth_manager_status: data.wealthManagerStatus,
      primary_goal: data.primaryGoal,
      timeline: data.timeline,
      biggest_challenge: data.biggestChallenge,
      investable_assets: data.investableAssets,
      qualified: data.qualified,
      hot_lead: data.hotLead,
      score: data.score,
    })

    if (error) {
      console.error("[v0] Error submitting consultation:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error submitting consultation:", error)
    return { success: false, error: "Failed to submit consultation" }
  }
}

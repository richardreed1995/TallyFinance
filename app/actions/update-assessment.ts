"use server"

import { createClient } from "@/lib/supabase/server"

export async function createAssessmentRecord() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("assessment_submissions")
      .insert({
        // Start with minimal data, will be updated as user progresses
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error creating assessment record:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (error) {
    console.error("Error creating assessment record:", error)
    return { success: false, error: "Failed to create assessment record" }
  }
}

export async function updateAssessmentRecord(id: string, data: Record<string, any>) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("assessment_submissions").update(data).eq("id", id)

    if (error) {
      console.error("Error updating assessment record:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating assessment record:", error)
    return { success: false, error: "Failed to update assessment record" }
  }
}

"use server"

import { createClient } from "@/lib/supabase/server"

export async function createConsultationRecord() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("consultation_submissions")
      .insert({
        // Start with minimal data, will be updated as user progresses
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error creating consultation record:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (error) {
    console.error("Error creating consultation record:", error)
    return { success: false, error: "Failed to create consultation record" }
  }
}

export async function updateConsultationRecord(id: string, data: Record<string, any>) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("consultation_submissions").update(data).eq("id", id)

    if (error) {
      console.error("Error updating consultation record:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating consultation record:", error)
    return { success: false, error: "Failed to update consultation record" }
  }
}

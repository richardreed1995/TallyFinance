"use server"

import { createCompaniesHouseAPI } from "@/lib/companies-house"
import { createClient } from "@/lib/supabase/server"

export async function searchCompanies(query: string) {
  try {
    const api = createCompaniesHouseAPI()
    const results = await api.searchCompany(query)
    
    return {
      success: true,
      data: results
    }
  } catch (error) {
    console.error("Companies House search error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search companies"
    }
  }
}

export async function getCompanyDetails(companyNumber: string) {
  try {
    const api = createCompaniesHouseAPI()
    const details = await api.getCompanyDetails(companyNumber)
    
    return {
      success: true,
      data: details
    }
  } catch (error) {
    console.error("Companies House details error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get company details"
    }
  }
}

export async function getCompanyOfficers(companyNumber: string) {
  try {
    const api = createCompaniesHouseAPI()
    const officers = await api.getCompanyOfficers(companyNumber)
    
    return {
      success: true,
      data: officers
    }
  } catch (error) {
    console.error("Companies House officers error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get company officers"
    }
  }
}

export async function saveCompanyDetails(
  submissionId: string,
  companyDetails: {
    company_number: string
    company_name: string
    company_status: string
    company_type: string
    date_of_creation: string
    registered_office_address: any
    sic_codes?: string[]
  }
) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('assessment_submissions')
      .update({
        company_number: companyDetails.company_number,
        company_name: companyDetails.company_name,
        company_status: companyDetails.company_status,
        company_type: companyDetails.company_type,
        company_incorporation_date: companyDetails.date_of_creation,
        company_address: companyDetails.registered_office_address,
        company_sic_codes: companyDetails.sic_codes,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)

    if (error) {
      throw error
    }

    return {
      success: true
    }
  } catch (error) {
    console.error("Error saving company details:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save company details"
    }
  }
}

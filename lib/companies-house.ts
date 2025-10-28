export interface CompanyDetails {
  company_number: string
  company_name: string
  company_status: string
  company_type: string
  date_of_creation: string
  registered_office_address: {
    address_line_1: string
    address_line_2?: string
    locality?: string
    postal_code: string
    country: string
  }
  sic_codes?: string[]
  description?: string
}

export interface CompanyOfficer {
  name: string
  officer_role: string
  appointed_on: string
  nationality?: string
  occupation?: string
  date_of_birth?: {
    month: number
    year: number
  }
  links: {
    self: string
  }
}

export interface CompanyOfficersResponse {
  total_results: number
  items: CompanyOfficer[]
}

export interface CompanySearchResult {
  company_number: string
  title: string
  company_status: string
  company_type: string
  date_of_creation: string
  address_snippet: string
  description?: string
  links: {
    self: string
  }
}

export interface CompaniesHouseSearchResponse {
  total_results: number
  items: CompanySearchResult[]
}

export class CompaniesHouseAPI {
  private apiKey: string
  private baseUrl = 'https://api.company-information.service.gov.uk'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchCompany(query: string): Promise<CompaniesHouseSearchResponse> {
    const response = await fetch(
      `${this.baseUrl}/search/companies?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Companies House API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getCompanyDetails(companyNumber: string): Promise<CompanyDetails> {
    const response = await fetch(
      `${this.baseUrl}/company/${companyNumber}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Companies House API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getCompanyOfficers(companyNumber: string): Promise<CompanyOfficersResponse> {
    const response = await fetch(
      `${this.baseUrl}/company/${companyNumber}/officers`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Companies House API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

// Server-side function to create API instance
export function createCompaniesHouseAPI(): CompaniesHouseAPI {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY
  
  if (!apiKey) {
    throw new Error('COMPANIES_HOUSE_API_KEY environment variable is not set')
  }

  return new CompaniesHouseAPI(apiKey)
}

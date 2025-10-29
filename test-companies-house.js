// Test script to verify Companies House data saving
// Run with: node test-companies-house.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testCompaniesHouseData() {
  console.log('🏢 Testing Companies House Data Storage...')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  
  try {
    // Get the latest assessment record
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      console.log('❌ Error fetching data:', error.message)
      return
    }
    
    console.log('📊 Latest Assessment Record:')
    console.log('ID:', data.id)
    console.log('Company Name:', data.company_name)
    console.log('Company Number:', data.company_number)
    console.log('Company Status:', data.company_status)
    console.log('Company Type:', data.company_type)
    console.log('Incorporation Date:', data.company_incorporation_date)
    console.log('Company Address:', data.company_address)
    console.log('SIC Codes:', data.company_sic_codes)
    console.log('Company Description:', data.company_description)
    console.log('Company Jurisdiction:', data.company_jurisdiction)
    console.log('Company Type Full:', data.company_company_type_full)
    console.log('Company Officers Count:', data.company_officers ? data.company_officers.length : 0)
    console.log('Director Name:', data.director_name)
    console.log('Director Role:', data.director_role)
    console.log('Director Appointed Date:', data.director_appointed_date)
    console.log('Director Nationality:', data.director_nationality)
    console.log('Director Occupation:', data.director_occupation)
    
    // Check if company data is populated
    const hasCompanyData = data.company_name && data.company_number
    console.log('\n✅ Company Data Status:', hasCompanyData ? 'POPULATED' : 'EMPTY')
    
    if (hasCompanyData) {
      console.log('🎉 Companies House data is being saved successfully!')
    } else {
      console.log('⚠️  No company data found. Try selecting a company in the assessment.')
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

testCompaniesHouseData()

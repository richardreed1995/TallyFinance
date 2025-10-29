// Simple debug script to check Supabase table
// Run with: node debug-table.js

const { createClient } = require('@supabase/supabase-js')

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

// Get credentials from environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function checkTable() {
  console.log('🔍 Checking Supabase table...')
  
  console.log('📋 Environment Variables:')
  console.log('URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('Key:', SUPABASE_KEY ? '✅ Set' : '❌ Missing')
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('❌ Missing Supabase credentials in .env.local')
    return
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  
  try {
    // Try to select from the table
    console.log('📋 Testing table access...')
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Error:', error.message)
      
      if (error.message.includes('relation "assessment_submissions" does not exist')) {
        console.log('\n🔧 SOLUTION: Table does not exist!')
        console.log('Run this SQL in your Supabase dashboard:')
        console.log('')
        console.log('-- Copy and paste scripts/012_simple_table_setup.sql')
        console.log('-- Or run the migration from scripts/009_complete_assessment_setup.sql')
      }
    } else {
      console.log('✅ Table exists and is accessible!')
      console.log('📊 Found', data.length, 'records')
      if (data.length > 0) {
        console.log('📋 Sample record:', data[0])
      }
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

checkTable()

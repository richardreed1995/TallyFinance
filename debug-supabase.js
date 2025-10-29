// Debug script to check Supabase connection and table structure
// Run this with: node debug-supabase.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function debugSupabase() {
  console.log('🔍 Debugging Supabase Connection...')
  
  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('📋 Environment Variables:')
  console.log('URL:', url ? '✅ Set' : '❌ Missing')
  console.log('Key:', key ? '✅ Set' : '❌ Missing')
  
  if (!url || !key) {
    console.log('❌ Missing Supabase credentials. Please check your .env.local file.')
    return
  }
  
  // Create client
  const supabase = createClient(url, key)
  
  try {
    // Test connection
    console.log('\n🔗 Testing connection...')
    const { data, error } = await supabase.from('assessment_submissions').select('count').limit(1)
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      
      // Check if table exists
      if (error.message.includes('relation "assessment_submissions" does not exist')) {
        console.log('\n📋 Table does not exist! You need to run the migration.')
        console.log('Run this in your Supabase SQL editor:')
        console.log('scripts/012_simple_table_setup.sql')
      }
    } else {
      console.log('✅ Connection successful!')
      console.log('📊 Table exists and is accessible')
    }
    
    // Try to get table structure
    console.log('\n🔍 Checking table structure...')
    const { data: structure, error: structureError } = await supabase
      .rpc('get_table_structure', { table_name: 'assessment_submissions' })
    
    if (structureError) {
      console.log('⚠️  Could not get table structure:', structureError.message)
    } else {
      console.log('📋 Table structure:', structure)
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

debugSupabase()

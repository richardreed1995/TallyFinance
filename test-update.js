// Test script to verify Supabase update works
// Run with: node test-update.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testUpdate() {
  console.log('🧪 Testing Supabase update...')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  
  try {
    // Test updating the existing record
    const testData = {
      current_question: 1,
      answers: { "1": [0] },
      questions_answered: [1],
      business_owner: true
    }
    
    console.log('📋 Testing update with data:', testData)
    
    const { data, error } = await supabase
      .from('assessment_submissions')
      .update(testData)
      .eq('id', 'b759e22d-7320-4016-a788-b25058d866f5')
      .select()
      .single()
    
    if (error) {
      console.log('❌ Update failed:', error.message)
      console.log('🔍 Error details:', error)
    } else {
      console.log('✅ Update successful!')
      console.log('📊 Updated record:', data)
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

testUpdate()

// Test script to verify the new question-ordered schema
// Run with: node test-question-order.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testQuestionOrder() {
  console.log('📋 Testing Question-Ordered Schema...')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  
  try {
    // Test creating a new assessment with the new field names
    const testData = {
      question_1_business_owner: true,
      question_2_loan_amount: 100000,
      question_3_trading_time: "24+ months",
      question_4_annual_turnover: 500000,
      question_5_company_type: "Limited company",
      question_6_finance_purpose: "Working capital",
      question_7_credit_profile: "Excellent",
      question_8_homeowner: true,
      current_question: 8,
      answers: {
        1: [0], // Question 1: Yes (business owner)
        2: [0], // Question 2: £10k-£50k option (but we're storing actual amount)
        3: [0], // Question 3: 24+ months
        4: [0], // Question 4: Under £50k option (but we're storing actual amount)
        5: [0], // Question 5: Limited company
        6: [0], // Question 6: Working capital
        7: [0], // Question 7: Excellent
        8: [0]  // Question 8: Yes (homeowner)
      },
      questions_answered: [1, 2, 3, 4, 5, 6, 7, 8],
      is_completed: true,
      score: 75,
      qualification_status: "qualified"
    }
    
    console.log('🧪 Testing new schema with sample data...')
    
    const { data, error } = await supabase
      .from('assessment_submissions')
      .insert(testData)
      .select()
      .single()
    
    if (error) {
      console.log('❌ Error testing new schema:', error.message)
      console.log('💡 Make sure you\'ve run the migration script: scripts/015_reorder_questions_to_match_assessment.sql')
      return
    }
    
    console.log('✅ Successfully created test record with new schema!')
    console.log('📊 Test Record ID:', data.id)
    console.log('📋 Question Fields:')
    console.log('  Q1 Business Owner:', data.question_1_business_owner)
    console.log('  Q2 Loan Amount:', data.question_2_loan_amount)
    console.log('  Q3 Trading Time:', data.question_3_trading_time)
    console.log('  Q4 Annual Turnover:', data.question_4_annual_turnover)
    console.log('  Q5 Company Type:', data.question_5_company_type)
    console.log('  Q6 Finance Purpose:', data.question_6_finance_purpose)
    console.log('  Q7 Credit Profile:', data.question_7_credit_profile)
    console.log('  Q8 Homeowner:', data.question_8_homeowner)
    
    // Clean up test record
    await supabase
      .from('assessment_submissions')
      .delete()
      .eq('id', data.id)
    
    console.log('🧹 Test record cleaned up')
    console.log('🎉 Schema update successful! The assessment table now matches the exact question order.')
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

testQuestionOrder()

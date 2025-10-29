-- Test script to verify the assessment_submissions table works correctly
-- Run this in your Supabase SQL editor after running the main migration

-- Test inserting a new assessment record
INSERT INTO public.assessment_submissions (
  business_owner,
  loan_amount,
  trading_time,
  annual_turnover,
  company_type,
  finance_purpose,
  credit_profile,
  homeowner,
  current_question,
  answers,
  questions_answered,
  is_completed
) VALUES (
  true,
  100000,
  '24+ months',
  250000,
  'Limited company',
  'Working capital',
  'Excellent',
  true,
  3,
  '{"1": [0], "2": [0], "3": [0]}'::jsonb,
  '{1, 2, 3}',
  false
);

-- Test updating the record
UPDATE public.assessment_submissions 
SET 
  current_question = 4,
  answers = '{"1": [0], "2": [0], "3": [0], "4": [0]}'::jsonb,
  questions_answered = '{1, 2, 3, 4}',
  annual_turnover = 300000
WHERE business_owner = true;

-- Test completing the assessment
UPDATE public.assessment_submissions 
SET 
  is_completed = true,
  score = 85,
  qualification_status = 'qualified',
  email = 'test@example.com',
  first_name = 'John',
  last_name = 'Doe',
  phone = '+447123456789',
  consent_given = true
WHERE business_owner = true;

-- Verify the data
SELECT 
  id,
  business_owner,
  loan_amount,
  trading_time,
  annual_turnover,
  company_type,
  current_question,
  answers,
  questions_answered,
  is_completed,
  score,
  qualification_status,
  email,
  first_name,
  last_name,
  phone,
  consent_given,
  created_at,
  updated_at
FROM public.assessment_submissions 
WHERE business_owner = true;

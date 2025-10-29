-- Update assessment_submissions table to match exact question order
-- Run this in your Supabase SQL editor

-- First, let's rename the existing columns to match the question order
-- Question 1: Are you a business owner?
ALTER TABLE public.assessment_submissions 
RENAME COLUMN business_owner TO question_1_business_owner;

-- Question 2: How much would you like to borrow?
ALTER TABLE public.assessment_submissions 
RENAME COLUMN loan_amount TO question_2_loan_amount;

-- Question 3: How long have you been trading?
ALTER TABLE public.assessment_submissions 
RENAME COLUMN trading_time TO question_3_trading_time;

-- Question 4: What is your annual turnover?
ALTER TABLE public.assessment_submissions 
RENAME COLUMN annual_turnover TO question_4_annual_turnover;

-- Question 5: Company Type?
ALTER TABLE public.assessment_submissions 
RENAME COLUMN company_type TO question_5_company_type;

-- Question 6: What will the finance be used for?
ALTER TABLE public.assessment_submissions 
RENAME COLUMN finance_purpose TO question_6_finance_purpose;

-- Question 7: How is your personal credit profile?
ALTER TABLE public.assessment_submissions 
RENAME COLUMN credit_profile TO question_7_credit_profile;

-- Question 8: Are you a homeowner?
ALTER TABLE public.assessment_submissions 
RENAME COLUMN homeowner TO question_8_homeowner;

-- Add comments to make the schema self-documenting
COMMENT ON COLUMN public.assessment_submissions.question_1_business_owner IS 'Question 1: Are you a business owner?';
COMMENT ON COLUMN public.assessment_submissions.question_2_loan_amount IS 'Question 2: How much would you like to borrow?';
COMMENT ON COLUMN public.assessment_submissions.question_3_trading_time IS 'Question 3: How long have you been trading?';
COMMENT ON COLUMN public.assessment_submissions.question_4_annual_turnover IS 'Question 4: What is your annual turnover?';
COMMENT ON COLUMN public.assessment_submissions.question_5_company_type IS 'Question 5: Company Type?';
COMMENT ON COLUMN public.assessment_submissions.question_6_finance_purpose IS 'Question 6: What will the finance be used for?';
COMMENT ON COLUMN public.assessment_submissions.question_7_credit_profile IS 'Question 7: How is your personal credit profile?';
COMMENT ON COLUMN public.assessment_submissions.question_8_homeowner IS 'Question 8: Are you a homeowner?';

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'assessment_submissions'
AND column_name LIKE 'question_%'
ORDER BY column_name;

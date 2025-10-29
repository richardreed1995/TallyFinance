-- Update assessment_submissions table to match actual assessment questions
-- First, drop the old columns that don't match the current assessment
ALTER TABLE assessment_submissions 
DROP COLUMN IF EXISTS age_range,
DROP COLUMN IF EXISTS net_worth,
DROP COLUMN IF EXISTS investment_portfolio,
DROP COLUMN IF EXISTS primary_goal,
DROP COLUMN IF EXISTS tax_strategy,
DROP COLUMN IF EXISTS estate_plan,
DROP COLUMN IF EXISTS fee_structure,
DROP COLUMN IF EXISTS risk_tolerance,
DROP COLUMN IF EXISTS diversification,
DROP COLUMN IF EXISTS rebalancing,
DROP COLUMN IF EXISTS financial_advisor,
DROP COLUMN IF EXISTS advisor_communication,
DROP COLUMN IF EXISTS investment_performance;

-- Add new columns that match the actual assessment questions
ALTER TABLE assessment_submissions 
ADD COLUMN IF NOT EXISTS business_owner BOOLEAN,
ADD COLUMN IF NOT EXISTS loan_amount INTEGER,
ADD COLUMN IF NOT EXISTS trading_time VARCHAR(50),
ADD COLUMN IF NOT EXISTS annual_turnover INTEGER,
ADD COLUMN IF NOT EXISTS company_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS finance_purpose VARCHAR(100),
ADD COLUMN IF NOT EXISTS credit_profile VARCHAR(50),
ADD COLUMN IF NOT EXISTS homeowner BOOLEAN,
ADD COLUMN IF NOT EXISTS current_question INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;

-- Make first_name, last_name, email, phone, consent_given nullable since they're collected later
ALTER TABLE assessment_submissions 
ALTER COLUMN first_name DROP NOT NULL,
ALTER COLUMN last_name DROP NOT NULL,
ALTER COLUMN email DROP NOT NULL,
ALTER COLUMN phone DROP NOT NULL,
ALTER COLUMN consent_given DROP NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_current_question ON public.assessment_submissions(current_question);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_is_completed ON public.assessment_submissions(is_completed);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_qualification_status ON public.assessment_submissions(qualification_status);

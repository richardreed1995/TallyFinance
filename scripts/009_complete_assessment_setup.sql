-- Complete assessment_submissions table setup for TallyFinance
-- This script creates the table with all necessary fields for the assessment flow

-- Create assessment_submissions table
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Lead information (collected during lead capture)
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  consent_given BOOLEAN DEFAULT FALSE,
  
  -- Assessment question answers
  business_owner BOOLEAN,
  loan_amount INTEGER,
  trading_time VARCHAR(50),
  annual_turnover INTEGER,
  company_type VARCHAR(50),
  finance_purpose VARCHAR(100),
  credit_profile VARCHAR(50),
  homeowner BOOLEAN,
  
  -- Progress tracking
  current_question INTEGER DEFAULT 0,
  answers JSONB DEFAULT '{}',
  questions_answered INTEGER[] DEFAULT '{}', -- Array to track which questions have been answered in order
  is_completed BOOLEAN DEFAULT FALSE,
  
  -- Results
  score INTEGER,
  qualification_status TEXT CHECK (qualification_status IN ('qualified', 'not-qualified')),
  
  -- Company details (from Companies House lookup)
  company_number VARCHAR(20),
  company_name VARCHAR(255),
  company_status VARCHAR(50),
  company_incorporation_date DATE,
  company_address JSONB,
  company_sic_codes TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_email ON public.assessment_submissions(email);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_created_at ON public.assessment_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_current_question ON public.assessment_submissions(current_question);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_is_completed ON public.assessment_submissions(is_completed);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_qualification_status ON public.assessment_submissions(qualification_status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.assessment_submissions;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.assessment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS) for better security
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on assessment_submissions" ON public.assessment_submissions
  FOR ALL USING (true);

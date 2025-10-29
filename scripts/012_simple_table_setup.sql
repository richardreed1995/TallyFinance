-- Simple assessment_submissions table creation
-- Run this first if the complex migration fails

-- Drop table if it exists (for testing)
DROP TABLE IF EXISTS public.assessment_submissions;

-- Create the basic table structure
CREATE TABLE public.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic fields
  current_question INTEGER DEFAULT 0,
  answers JSONB DEFAULT '{}',
  questions_answered INTEGER[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT FALSE,
  
  -- Assessment answers
  business_owner BOOLEAN,
  loan_amount INTEGER,
  trading_time VARCHAR(50),
  annual_turnover INTEGER,
  company_type VARCHAR(50),
  finance_purpose VARCHAR(100),
  credit_profile VARCHAR(50),
  homeowner BOOLEAN,
  
  -- Results
  score INTEGER,
  qualification_status TEXT CHECK (qualification_status IN ('qualified', 'not-qualified')),
  
  -- Lead information
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  consent_given BOOLEAN DEFAULT FALSE,
  
  -- Company details
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

-- Create indexes
CREATE INDEX idx_assessment_submissions_current_question ON public.assessment_submissions(current_question);
CREATE INDEX idx_assessment_submissions_is_completed ON public.assessment_submissions(is_completed);

-- Enable RLS
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
CREATE POLICY "Allow all operations on assessment_submissions" ON public.assessment_submissions
  FOR ALL USING (true);

-- Test insert
INSERT INTO public.assessment_submissions (current_question, answers, questions_answered) 
VALUES (0, '{}', '{}');

-- Test select
SELECT * FROM public.assessment_submissions;

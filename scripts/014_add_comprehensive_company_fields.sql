-- Add additional Companies House fields to assessment_submissions table
-- Run this in your Supabase SQL editor

-- Add fields for director information
ALTER TABLE public.assessment_submissions 
ADD COLUMN IF NOT EXISTS director_name TEXT,
ADD COLUMN IF NOT EXISTS director_role TEXT,
ADD COLUMN IF NOT EXISTS director_appointed_date DATE,
ADD COLUMN IF NOT EXISTS director_nationality TEXT,
ADD COLUMN IF NOT EXISTS director_occupation TEXT;

-- Add fields for additional company information
ALTER TABLE public.assessment_submissions 
ADD COLUMN IF NOT EXISTS company_description TEXT,
ADD COLUMN IF NOT EXISTS company_previous_names JSONB,
ADD COLUMN IF NOT EXISTS company_jurisdiction TEXT,
ADD COLUMN IF NOT EXISTS company_company_type_full TEXT,
ADD COLUMN IF NOT EXISTS company_has_been_liquidated BOOLEAN,
ADD COLUMN IF NOT EXISTS company_has_insolvency_history BOOLEAN;

-- Add fields for company officers/directors list
ALTER TABLE public.assessment_submissions 
ADD COLUMN IF NOT EXISTS company_officers JSONB;

-- Verify the new fields
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'assessment_submissions'
AND column_name IN (
  'director_name', 'director_role', 'director_appointed_date', 
  'director_nationality', 'director_occupation',
  'company_description', 'company_previous_names', 'company_jurisdiction',
  'company_company_type_full', 'company_has_been_liquidated', 
  'company_has_insolvency_history', 'company_officers'
)
ORDER BY column_name;

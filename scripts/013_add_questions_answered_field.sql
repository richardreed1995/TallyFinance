-- Add missing questions_answered field to existing table
-- Run this in your Supabase SQL editor

-- Add the missing field
ALTER TABLE public.assessment_submissions 
ADD COLUMN IF NOT EXISTS questions_answered INTEGER[] DEFAULT '{}';

-- Verify the change
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'assessment_submissions'
AND column_name = 'questions_answered';

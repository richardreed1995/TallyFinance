-- Add tracking fields to assessment_submissions table
ALTER TABLE public.assessment_submissions 
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS utm_term TEXT,
ADD COLUMN IF NOT EXISTS utm_content TEXT,
ADD COLUMN IF NOT EXISTS click_id TEXT;

-- Verify the new fields
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'assessment_submissions'
AND column_name IN (
  'utm_source', 'utm_medium', 'utm_campaign', 
  'utm_term', 'utm_content', 'click_id'
)
ORDER BY column_name;


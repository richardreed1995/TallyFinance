-- Check if assessment_submissions table exists and its structure
-- Run this in your Supabase SQL editor to debug

-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'assessment_submissions'
);

-- If table exists, show its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'assessment_submissions'
ORDER BY ordinal_position;

-- Check if there are any existing records
SELECT COUNT(*) as record_count FROM public.assessment_submissions;

-- If there are records, show the first one
SELECT * FROM public.assessment_submissions LIMIT 1;

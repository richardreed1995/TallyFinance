-- Add employment_status column to consultation_submissions table
ALTER TABLE consultation_submissions 
ADD COLUMN IF NOT EXISTS employment_status TEXT;

-- Add comment to document the column
COMMENT ON COLUMN consultation_submissions.employment_status IS 'Employment status: Business owner, Retired, or Employed';

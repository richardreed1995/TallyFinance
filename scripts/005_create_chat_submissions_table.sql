-- Create chat_submissions table for chat flow submissions
-- This separates chat submissions from consultation form submissions

CREATE TABLE IF NOT EXISTS chat_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employment_status TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  wealth_manager_status TEXT,
  primary_goal TEXT,
  timeline TEXT,
  biggest_challenge TEXT,
  investable_assets TEXT,
  qualified BOOLEAN DEFAULT false,
  hot_lead BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_submissions_created_at ON chat_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_submissions_qualified ON chat_submissions(qualified);

-- Create consultation_submissions table
CREATE TABLE IF NOT EXISTS consultation_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  wealth_manager_status TEXT,
  primary_goal TEXT,
  timeline TEXT,
  biggest_challenge TEXT,
  investable_assets TEXT,
  qualified BOOLEAN DEFAULT false,
  hot_lead BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_consultation_submissions_email ON consultation_submissions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_consultation_submissions_created_at ON consultation_submissions(created_at DESC);

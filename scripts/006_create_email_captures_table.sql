-- Create email_captures table for simple email collection
CREATE TABLE IF NOT EXISTS email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email);

-- Add index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_email_captures_created_at ON email_captures(created_at DESC);

-- Migration to allow NULL values for contact fields in consultation_submissions
-- These fields will be populated incrementally as the user progresses through the consultation

ALTER TABLE consultation_submissions
  ALTER COLUMN first_name DROP NOT NULL,
  ALTER COLUMN last_name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN phone DROP NOT NULL;

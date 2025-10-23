-- Migration to allow NULL values for contact fields
-- These fields will be populated later when the user submits the lead capture form

ALTER TABLE assessment_submissions
  ALTER COLUMN first_name DROP NOT NULL,
  ALTER COLUMN last_name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN phone DROP NOT NULL;

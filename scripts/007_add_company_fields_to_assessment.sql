-- Add company fields to assessment_submissions table
ALTER TABLE assessment_submissions 
ADD COLUMN company_number VARCHAR(20),
ADD COLUMN company_name VARCHAR(255),
ADD COLUMN company_status VARCHAR(50),
ADD COLUMN company_type VARCHAR(100),
ADD COLUMN company_incorporation_date DATE,
ADD COLUMN company_address JSONB,
ADD COLUMN company_sic_codes TEXT[];

-- Add rejection_reason column to registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

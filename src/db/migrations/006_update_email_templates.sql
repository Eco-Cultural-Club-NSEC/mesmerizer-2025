-- Start transaction
BEGIN;

-- Drop existing data safely
TRUNCATE email_logs CASCADE;
TRUNCATE email_templates CASCADE;

-- Reset sequences
ALTER SEQUENCE email_templates_id_seq RESTART WITH 1;
ALTER SEQUENCE email_logs_id_seq RESTART WITH 1;

-- Update email_templates table structure if needed
ALTER TABLE email_templates 
ADD COLUMN IF NOT EXISTS template_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add new constraints
ALTER TABLE email_templates 
ADD CONSTRAINT valid_template_type 
CHECK (template_type IN ('approval', 'rejection', 'reminder', 'notification'));

COMMIT;

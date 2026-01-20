-- =====================================================
-- FIX: employee_code NOT NULL constraint
-- =====================================================
-- The employees table has a NOT NULL constraint on employee_code
-- but we're not providing it when creating employees.
-- 
-- Option 1: Make employee_code nullable (recommended for now)
-- Option 2: Auto-generate employee codes

-- OPTION 1: Make employee_code nullable
ALTER TABLE public.employees 
ALTER COLUMN employee_code DROP NOT NULL;

-- OPTION 2: Auto-generate employee codes (alternative)
-- Uncomment this if you want auto-generated codes instead:
/*
-- Create a sequence for employee codes
CREATE SEQUENCE IF NOT EXISTS employee_code_seq START 1000;

-- Add default value to auto-generate codes
ALTER TABLE public.employees 
ALTER COLUMN employee_code SET DEFAULT 'EMP' || LPAD(nextval('employee_code_seq')::text, 6, '0');

-- Update existing NULL values
UPDATE public.employees 
SET employee_code = 'EMP' || LPAD(nextval('employee_code_seq')::text, 6, '0')
WHERE employee_code IS NULL;
*/

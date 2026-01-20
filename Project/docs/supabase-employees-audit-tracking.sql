-- =====================================================
-- Add Audit Tracking to Employees Table
-- =====================================================
-- This adds created_by and updated_by fields to track
-- who created and last updated each employee record
-- Uses auth.uid() to automatically populate these fields
-- =====================================================

-- Add audit tracking columns to employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id);

-- Create function to set created_by on insert
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to set updated_by on update
CREATE OR REPLACE FUNCTION public.set_updated_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for created_by (on insert)
DROP TRIGGER IF EXISTS set_employees_created_by ON public.employees;
CREATE TRIGGER set_employees_created_by
  BEFORE INSERT ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

-- Create trigger for updated_by (on update)
DROP TRIGGER IF EXISTS set_employees_updated_by ON public.employees;
CREATE TRIGGER set_employees_updated_by
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_by();

-- Create indexes for audit fields
CREATE INDEX IF NOT EXISTS idx_employees_created_by ON public.employees(created_by);
CREATE INDEX IF NOT EXISTS idx_employees_updated_by ON public.employees(updated_by);

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if columns were added
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'employees'
--   AND column_name IN ('created_by', 'updated_by');

-- Check if triggers exist
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers
-- WHERE event_object_table = 'employees'
--   AND trigger_name IN ('set_employees_created_by', 'set_employees_updated_by');

-- View employees with audit information
-- SELECT 
--   e.id,
--   e.department,
--   e.designation,
--   e.status,
--   creator.email as created_by_email,
--   e.created_at,
--   updater.email as updated_by_email,
--   e.updated_at
-- FROM public.employees e
-- LEFT JOIN auth.users creator ON e.created_by = creator.id
-- LEFT JOIN auth.users updater ON e.updated_by = updater.id;

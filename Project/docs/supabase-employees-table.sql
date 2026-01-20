-- =====================================================
-- Employees Table Schema
-- =====================================================
-- This creates the employees table with proper relationships
-- to auth.users and profiles tables
-- =====================================================

-- Create employees table
CREATE TABLE IF NOT EXISTS public.employees (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  department text,
  designation text,
  manager_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_profile_id ON public.employees(profile_id);
CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON public.employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON public.employees(department);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_employees_updated_at ON public.employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view all employees (for employee directory)
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;
CREATE POLICY "Authenticated users can view employees"
  ON public.employees
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Users can update their own employee record
DROP POLICY IF EXISTS "Users can update own employee record" ON public.employees;
CREATE POLICY "Users can update own employee record"
  ON public.employees
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Admins can insert employees
DROP POLICY IF EXISTS "Admins can insert employees" ON public.employees;
CREATE POLICY "Admins can insert employees"
  ON public.employees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'ADMIN'
    )
  );

-- RLS Policy: Admins can update any employee
DROP POLICY IF EXISTS "Admins can update employees" ON public.employees;
CREATE POLICY "Admins can update employees"
  ON public.employees
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'ADMIN'
    )
  );

-- RLS Policy: Admins can delete employees
DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;
CREATE POLICY "Admins can delete employees"
  ON public.employees
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'ADMIN'
    )
  );

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if employees table exists
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name = 'employees';

-- Check employees table structure
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'employees'
-- ORDER BY ordinal_position;

-- View all employees
-- SELECT * FROM public.employees;

-- View employees with their manager names
-- SELECT 
--   e.id,
--   p.email as employee_email,
--   e.department,
--   e.designation,
--   e.status,
--   m.email as manager_email,
--   e.created_at
-- FROM public.employees e
-- LEFT JOIN public.profiles p ON e.profile_id = p.id
-- LEFT JOIN public.employees me ON e.manager_id = me.id
-- LEFT JOIN public.profiles m ON me.profile_id = m.id;

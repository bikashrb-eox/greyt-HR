-- =====================================================
-- RLS Select Policies for Employees Table
-- =====================================================
-- This creates two select policies:
-- 1. HR/Admin can read all employees
-- 2. Employees can read only their own record
-- =====================================================

-- Drop the existing broad select policy
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;

-- Policy 1: HR and Admin can read all employees
CREATE POLICY "HR and Admin can read all employees"
  ON public.employees
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM public.user_role_view
      WHERE user_id = auth.uid() 
        AND role_name IN ('HR', 'ADMIN')
    )
  );

-- Policy 2: Employees can read only their own record
CREATE POLICY "Employees can read own record"
  ON public.employees
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if policies exist
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'employees' AND cmd = 'SELECT';

-- Test if current user can read all employees (should return true for HR/Admin)
-- SELECT EXISTS (
--   SELECT 1 
--   FROM public.user_role_view
--   WHERE user_id = auth.uid() 
--     AND role_name IN ('HR', 'ADMIN')
-- ) AS can_read_all;

-- View all policies on employees table
-- SELECT policyname, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'employees'
-- ORDER BY cmd, policyname;

-- Test query: Try to read employees (will show all for HR/Admin, only own for others)
-- SELECT * FROM public.employees;

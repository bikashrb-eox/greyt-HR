-- =====================================================
-- RLS Policy for HR and Admin Insert on Employees
-- =====================================================
-- This policy allows only users with 'HR' or 'ADMIN' roles
-- to insert records into the employees table
-- Uses the user_role_view for role checking
-- =====================================================

-- Drop the existing admin-only insert policy
DROP POLICY IF EXISTS "Admins can insert employees" ON public.employees;

-- Create new policy for HR and Admin insert
CREATE POLICY "HR and Admin can insert employees"
  ON public.employees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.user_role_view
      WHERE user_id = auth.uid() 
        AND role_name IN ('HR', 'ADMIN')
    )
  );

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if policy exists
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'employees' AND policyname = 'HR and Admin can insert employees';

-- Test if current user can insert (should return true for HR/Admin)
-- SELECT EXISTS (
--   SELECT 1 
--   FROM public.user_role_view
--   WHERE user_id = auth.uid() 
--     AND role_name IN ('HR', 'ADMIN')
-- ) AS can_insert;

-- View all policies on employees table
-- SELECT policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'employees';

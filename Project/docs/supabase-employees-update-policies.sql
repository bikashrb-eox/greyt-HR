-- =====================================================
-- RLS Update Policies for Employees Table
-- =====================================================
-- This creates update policies:
-- 1. HR/Admin can update any employee record
-- 2. Employees cannot update HR-managed fields
-- Delete operations are not allowed (no delete policy)
-- =====================================================

-- Drop existing update policies
DROP POLICY IF EXISTS "Users can update own employee record" ON public.employees;
DROP POLICY IF EXISTS "Admins can update employees" ON public.employees;

-- Policy 1: HR and Admin can update any employee record
CREATE POLICY "HR and Admin can update any employee"
  ON public.employees
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM public.user_role_view
      WHERE user_id = auth.uid() 
        AND role_name IN ('HR', 'ADMIN')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.user_role_view
      WHERE user_id = auth.uid() 
        AND role_name IN ('HR', 'ADMIN')
    )
  );

-- Policy 2: Employees can update only non-HR fields in their own record
-- HR-managed fields: department, designation, manager_id, status
-- Employees cannot update these fields
CREATE POLICY "Employees can update own non-HR fields"
  ON public.employees
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND department = (SELECT department FROM public.employees WHERE id = id)
    AND designation = (SELECT designation FROM public.employees WHERE id = id)
    AND manager_id IS NOT DISTINCT FROM (SELECT manager_id FROM public.employees WHERE id = id)
    AND status = (SELECT status FROM public.employees WHERE id = id)
  );

-- Note: Delete policy is intentionally NOT created
-- This means no one can delete employee records through RLS
-- Deletions must be done by database administrators or through backend logic

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check update policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'employees' AND cmd = 'UPDATE';

-- Check that no delete policy exists
-- SELECT schemaname, tablename, policyname, cmd
-- FROM pg_policies
-- WHERE tablename = 'employees' AND cmd = 'DELETE';

-- Test if current user can update all fields (should return true for HR/Admin)
-- SELECT EXISTS (
--   SELECT 1 
--   FROM public.user_role_view
--   WHERE user_id = auth.uid() 
--     AND role_name IN ('HR', 'ADMIN')
-- ) AS can_update_all;

-- View all policies on employees table
-- SELECT policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'employees'
-- ORDER BY cmd, policyname;
